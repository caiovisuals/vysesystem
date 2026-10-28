import { useMemo } from "react"
import { PaymentMethod, Sale } from "@vysesystem/types"
import { useData } from "@/_contexts/DataContext"

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

// Relatório de vendas concluídas: resumo do dia, semana e mês e rankings do período selecionado
export function useSalesReport(period: SalesPeriod) {
    const { sales, employees: allEmployees, clients: allClients } = useData()

    return useMemo(() => {
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
            const employee = employees.get(sale.cashierId) ?? {
                id: sale.cashierId,
                name: sale.cashierName || allEmployees.find(e => e.id === sale.cashierId)?.name || `Colaborador #${sale.cashierId}`,
                count: 0,
                value: 0,
            }
            employee.count += 1
            employee.value += sale.total
            employees.set(sale.cashierId, employee)

            if (sale.customerId) {
                const customer = customers.get(sale.customerId) ?? {
                    id: sale.customerId,
                    name: sale.customerName || allClients.find(c => c.id === sale.customerId)?.name || `Cliente #${sale.customerId}`,
                    count: 0,
                    value: 0,
                }
                customer.count += 1
                customer.value += sale.total
                customers.set(sale.customerId, customer)
            }

            for (const item of sale.items) {
                const product = products.get(item.productId) ?? {
                    id: item.productId,
                    name: item.productName,
                    count: 0,
                    value: 0,
                }
                product.count += item.quantity
                product.value += item.total
                products.set(item.productId, product)
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
    }, [sales, period, allEmployees, allClients])
}