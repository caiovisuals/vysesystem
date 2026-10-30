import { Product } from "@vysesystem/types"
import type { ProductInput } from "@/_lib/schemas"
import { request } from "./http"

function reviveProduct(product: Product): Product {
    return { ...product, createdAt: new Date(product.createdAt) }
}

export async function getProducts() {
    const products = await request<Product[]>("/api/products")
    return products.map(reviveProduct)
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