import { Supplier } from "@vysesystem/types"
import type { SupplierInput } from "@vysesystem/schemas"
import { request } from "./http"

export function getSuppliers() {
    return request<Supplier[]>("/api/suppliers")
}

export function createSupplier(supplier: SupplierInput) {
    return request<Supplier>("/api/suppliers", {
        method: "POST",
        body: JSON.stringify(supplier),
    })
}

export function updateSupplier(id: string, data: Partial<SupplierInput>) {
    return request<Supplier>(`/api/suppliers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}

export function deleteSupplier(id: string) {
    return request<null>(`/api/suppliers/${id}`, { method: "DELETE" })
}