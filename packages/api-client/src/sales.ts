import { Sale, SaleStatus } from "@vysesystem/types"
import type { CreateSaleInput } from "@vysesystem/schemas"
import { request } from "./http"

function reviveSale(sale: Sale): Sale {
    return { ...sale, createdAt: new Date(sale.createdAt) }
}

export async function getSales() {
    const sales = await request<Sale[]>("/api/sales")
    return sales.map(reviveSale)
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