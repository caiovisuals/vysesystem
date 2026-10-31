import "server-only"
import type { PaymentMethod, PeriodSummary, RankingEntry, SalesReport, SalesStats, SaleStatus } from "@vysesystem/types"
import type { Prisma } from "@/generated/prisma/client"
import { getDb } from "@/_lib/db"
import { toCents } from "@/_lib/format"

const RANKING_SIZE = 5

export type ReportBoundaries = {
    todayStart: Date
    weekStart: Date
    monthStart: Date
    // Início do período dos rankings; sem ele, todo o histórico
    periodStart?: Date
}

function completedSince(companyId: string, start?: Date): Prisma.SaleWhereInput {
    return { companyId, status: "COMPLETED", ...(start ? { createdAt: { gte: start } } : {}) }
}

async function summarize(where: Prisma.SaleWhereInput): Promise<PeriodSummary> {
    const result = await getDb().sale.aggregate({ where, _sum: { total: true }, _count: true })
    return { revenue: Number(result._sum.total ?? 0), count: result._count }
}

// Relatório das vendas concluídas, todo calculado no banco (só os agregados trafegam)
export async function getSalesReport(companyId: string, bounds: ReportBoundaries): Promise<SalesReport> {
    const db = getDb()
    const period = completedSince(companyId, bounds.periodStart)

    const [today, week, month, periodSummary, employees, customers, products, payments] = await Promise.all([
        summarize(completedSince(companyId, bounds.todayStart)),
        summarize(completedSince(companyId, bounds.weekStart)),
        summarize(completedSince(companyId, bounds.monthStart)),
        summarize(period),
        // O nome fica gravado na venda, então o ranking continua certo mesmo depois de excluir o colaborador
        db.sale.groupBy({
            by: ["cashierId", "cashierName"],
            where: { ...period, OR: [{ cashierId: { not: null } }, { cashierName: { not: null } }] },
            _sum: { total: true },
            _count: { _all: true },
            orderBy: { _sum: { total: "desc" } },
            take: RANKING_SIZE,
        }),
        db.sale.groupBy({
            by: ["customerId"],
            where: { ...period, customerId: { not: null } },
            _sum: { total: true },
            _count: { _all: true },
            orderBy: { _sum: { total: "desc" } },
            take: RANKING_SIZE,
        }),
        db.saleItem.groupBy({
            by: ["productId", "productName"],
            where: { sale: period },
            _sum: { total: true, quantity: true },
            orderBy: { _sum: { total: "desc" } },
            take: RANKING_SIZE,
        }),
        db.sale.groupBy({
            by: ["paymentMethod"],
            where: period,
            _sum: { total: true },
            _count: { _all: true },
            orderBy: { _sum: { total: "desc" } },
        }),
    ])

    // Cliente excluído vira customerId null (SetNull), então todo id do ranking ainda existe na tabela
    const customerIds = customers.map(row => row.customerId).filter((id): id is string => id !== null)
    const customerRows = await db.client.findMany({ where: { companyId, id: { in: customerIds } }, select: { id: true, name: true } })
    const nameById = new Map(customerRows.map(client => [client.id, client.name]))

    const topEmployees: RankingEntry[] = employees.map(row => ({
        id: row.cashierId ?? `name:${row.cashierName}`,
        name: row.cashierName || `Colaborador #${row.cashierId}`,
        count: row._count._all,
        value: Number(row._sum.total ?? 0),
    }))

    const topCustomers: RankingEntry[] = customers.map(row => ({
        id: row.customerId!,
        name: nameById.get(row.customerId!) ?? `Cliente #${row.customerId}`,
        count: row._count._all,
        value: Number(row._sum.total ?? 0),
    }))

    const topProducts: RankingEntry[] = products.map(row => ({
        id: row.productId ?? `name:${row.productName}`,
        name: row.productName,
        count: row._sum.quantity ?? 0,
        value: Number(row._sum.total ?? 0),
    }))

    return {
        summary: { today, week, month, period: periodSummary },
        averageTicket: periodSummary.count > 0 ? toCents(periodSummary.revenue / periodSummary.count) : 0,
        topEmployees,
        topProducts,
        topCustomers,
        paymentMethods: payments.map(row => ({
            method: row.paymentMethod as PaymentMethod,
            revenue: Number(row._sum.total ?? 0),
            count: row._count._all,
        })),
    }
}

// Quantidade e valor das vendas por status
export async function getSalesStats(companyId: string, where: Prisma.SaleWhereInput = {}): Promise<SalesStats> {
    const rows = await getDb().sale.groupBy({
        by: ["status"],
        where: { ...where, companyId },
        _sum: { total: true },
        _count: { _all: true },
    })

    const byStatus: Record<SaleStatus, PeriodSummary> = {
        PENDING: { revenue: 0, count: 0 },
        COMPLETED: { revenue: 0, count: 0 },
        CANCELLED: { revenue: 0, count: 0 },
    }
    for (const row of rows) {
        byStatus[row.status] = { revenue: Number(row._sum.total ?? 0), count: row._count._all }
    }

    return { count: rows.reduce((sum, row) => sum + row._count._all, 0), byStatus }
}