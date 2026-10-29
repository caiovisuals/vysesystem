import { useMemo } from "react"
import { PaymentMethod, Sale } from "@vysesystem/types"
import { useSales } from "@/_hooks/use-sales"

export type SalesPeriod = "today" | "week" | "month" | "all"

export type RankingEntry = {
    id: string
    name: string
    count: number
    value: number
}

export type PeriodSummary = {
    revenue: number
    count: number
}

function startOfPeriod(period: SalesPeriod, now: Date): Date | null {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)

    switch (period) {
        case "today":
            return start
        case "week":
            // Semana começando no domingo
            start.setDate(start.getDate() - start.getDay())
            return start
        case "month":
            start.setDate(1)
            return start
        case "all":
            return null
    }
}

function filterByPeriod(sales: Sale[], period: SalesPeriod, now: Date): Sale[] {
    const start = startOfPeriod(period, now)
    if (!start) return sales
    return sales.filter(sale => new Date(sale.createdAt) >= start)
}

function summarize(sales: Sale[]): PeriodSummary {
    return {
        revenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        count: sales.length,
    }
}

function rank(entries: Map<string, RankingEntry>, limit = 5): RankingEntry[] {
    return Array.from(entries.values())
        .sort((a, b) => b.value - a.value)
        .slice(0, limit)
}

const NO_SALES: Sale[] = []

// Relatório de vendas concluídas: resumo do dia, semana e mês e rankings do período selecionado
export function useSalesReport(period: SalesPeriod) {
    const { data: sales = NO_SALES, isLoading, error } = useSales()

    const report = useMemo(() => {
        const now = new Date()
        const completed = sales.filter(sale => sale.status === "COMPLETED")
        const inPeriod = filterByPeriod(completed, period, now)

        const summary = {
            today: summarize(filterByPeriod(completed, "today", now)),
            week: summarize(filterByPeriod(completed, "week", now)),
            month: summarize(filterByPeriod(completed, "month", now)),
            period: summarize(inPeriod),
        }

        const employees = new Map<string, RankingEntry>()
        const products = new Map<string, RankingEntry>()
        const customers = new Map<string, RankingEntry>()
        const payments = new Map<PaymentMethod, PeriodSummary>()

        for (const sale of inPeriod) {
            const employeeKey = sale.cashierId || (sale.cashierName ? `name:${sale.cashierName}` : "")
            if (employeeKey) {
                const employee = employees.get(employeeKey) ?? {
                    id: employeeKey,
                    name: sale.cashierName || `Colaborador #${sale.cashierId}`,
                    count: 0,
                    value: 0,
                }
                employee.count += 1
                employee.value += sale.total
                employees.set(employeeKey, employee)
            }

            if (sale.customerId) {
                const customer = customers.get(sale.customerId) ?? {
                    id: sale.customerId,
                    name: sale.customerName || `Cliente #${sale.customerId}`,
                    count: 0,
                    value: 0,
                }
                customer.count += 1
                customer.value += sale.total
                customers.set(sale.customerId, customer)
            }

            for (const item of sale.items) {
                const productKey = item.productId || `name:${item.productName}`
                const product = products.get(productKey) ?? {
                    id: productKey,
                    name: item.productName,
                    count: 0,
                    value: 0,
                }
                product.count += item.quantity
                product.value += item.total
                products.set(productKey, product)
            }

            const payment = payments.get(sale.paymentMethod) ?? { revenue: 0, count: 0 }
            payment.revenue += sale.total
            payment.count += 1
            payments.set(sale.paymentMethod, payment)
        }

        return {
            summary,
            averageTicket: inPeriod.length > 0 ? summary.period.revenue / inPeriod.length : 0,
            topEmployees: rank(employees),
            topProducts: rank(products),
            topCustomers: rank(customers),
            paymentMethods: Array.from(payments.entries())
                .map(([method, data]) => ({ method, ...data }))
                .sort((a, b) => b.revenue - a.revenue),
        }
    }, [sales, period])

    return { ...report, isLoading, error }
}