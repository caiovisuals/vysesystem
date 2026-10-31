import type { PaymentMethod, SaleStatus } from "./sales"

// Resposta paginada das listagens da API (?page=&pageSize=)
export type Paginated<T> = {
    items: T[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export type SortOrder = "asc" | "desc"

export type ListParams = {
    page?: number
    pageSize?: number
    // Busca por texto (nome, e-mail, código etc., conforme o recurso)
    q?: string
    sortBy?: string
    order?: SortOrder
}

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

// Relatório de vendas concluídas, agregado no banco
export type SalesReport = {
    summary: {
        today: PeriodSummary
        week: PeriodSummary
        month: PeriodSummary
        period: PeriodSummary
    }
    averageTicket: number
    topEmployees: RankingEntry[]
    topProducts: RankingEntry[]
    topCustomers: RankingEntry[]
    paymentMethods: { method: PaymentMethod, revenue: number, count: number }[]
}

// Contagem e valor das vendas por status (todas as vendas da empresa)
export type SalesStats = {
    count: number
    byStatus: Record<SaleStatus, PeriodSummary>
}