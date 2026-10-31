import { ListParams, Paginated, Sale, SalesReport, SalesStats, SaleStatus } from "@vysesystem/types"
import type { CreateSaleInput } from "@vysesystem/schemas"
import { request } from "./http"
import { mapPage, toQuery } from "./query"

export type SaleListParams = ListParams & {
    status?: SaleStatus
    from?: Date
    to?: Date
}

export type SalesReportParams = {
    todayStart: Date
    weekStart: Date
    monthStart: Date
    periodStart?: Date
}

function reviveSale(sale: Sale): Sale {
    return { ...sale, createdAt: new Date(sale.createdAt) }
}

export async function getSales(params: SaleListParams = {}) {
    const page = await request<Paginated<Sale>>(`/api/sales${toQuery(params)}`)
    return mapPage(page, reviveSale)
}

export function getSalesReport(params: SalesReportParams) {
    return request<SalesReport>(`/api/sales/report${toQuery(params)}`)
}

export function getSalesStats(params: Pick<SaleListParams, "from" | "to"> = {}) {
    return request<SalesStats>(`/api/sales/stats${toQuery(params)}`)
}

export async function getSale(id: string) {
    return reviveSale(await request<Sale>(`/api/sales/${id}`))
}

export async function createSale(sale: CreateSaleInput) {
    return reviveSale(await request<Sale>("/api/sales", {
        method: "POST",
        body: JSON.stringify(sale),
    }))
}

export async function updateSaleStatus(id: string, status: SaleStatus) {
    return reviveSale(await request<Sale>(`/api/sales/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    }))
}