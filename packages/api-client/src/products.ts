import { ListParams, Paginated, Product } from "@vysesystem/types"
import type { ProductInput } from "@vysesystem/schemas"
import { request } from "./http"
import { mapPage, toQuery } from "./query"

function reviveProduct(product: Product): Product {
    return { ...product, createdAt: new Date(product.createdAt) }
}

// q casa o código exato (que vem primeiro na lista) ou parte do nome
export async function getProducts(params: ListParams = {}) {
    const page = await request<Paginated<Product>>(`/api/products${toQuery(params)}`)
    return mapPage(page, reviveProduct)
}

export async function createProduct(product: ProductInput) {
    return reviveProduct(await request<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify(product),
    }))
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    return reviveProduct(await request<Product>(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    }))
}

export function deleteProduct(id: string) {
    return request<null>(`/api/products/${id}`, { method: "DELETE" })
}