import { useQuery } from "@tanstack/react-query"
import type { PeriodSummary, SalesReport } from "@vysesystem/types"
import { getSalesReport } from "@vysesystem/api-client"
import { salesQueryKey } from "@/_hooks/use-sales"

export type { PeriodSummary, RankingEntry } from "@vysesystem/types"

export type SalesPeriod = "today" | "week" | "month" | "all"

// Início do período no fuso do navegador (meia-noite local), por isso os limites saem daqui e não do servidor
export function startOfPeriod(period: SalesPeriod, now: Date): Date | undefined {
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
            return undefined
    }
}

const EMPTY_SUMMARY: PeriodSummary = { revenue: 0, count: 0 }

const EMPTY_REPORT: SalesReport = {
    summary: { today: EMPTY_SUMMARY, week: EMPTY_SUMMARY, month: EMPTY_SUMMARY, period: EMPTY_SUMMARY },
    averageTicket: 0,
    topEmployees: [],
    topProducts: [],
    topCustomers: [],
    paymentMethods: [],
}

// Relatório de vendas concluídas: resumo do dia, semana e mês e rankings do período selecionado.
// Tudo é agregado no banco; só os totais chegam ao navegador
export function useSalesReport(period: SalesPeriod) {
    const now = new Date()
    const params = {
        todayStart: startOfPeriod("today", now)!,
        weekStart: startOfPeriod("week", now)!,
        monthStart: startOfPeriod("month", now)!,
        periodStart: startOfPeriod(period, now),
    }

    const { data, isLoading, error } = useQuery({
        // As datas são meia-noite, então a chave só muda quando o dia (ou o período) muda
        queryKey: [...salesQueryKey, "report", period, params.todayStart.toISOString()],
        queryFn: () => getSalesReport(params),
    })

    return { ...(data ?? EMPTY_REPORT), isLoading, error }
}