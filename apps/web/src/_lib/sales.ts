import type { SaleStatus } from "@/generated/prisma/client"

// Transições permitidas: PENDING → COMPLETED (baixa estoque), PENDING → CANCELLED e COMPLETED → CANCELLED (devolve estoque).
// Venda cancelada é final.
export function canChangeSaleStatus(from: SaleStatus, to: SaleStatus): boolean {
    return (from === "PENDING" && to !== "PENDING") ||
        (from === "COMPLETED" && to === "CANCELLED")
}

// Efeito da transição no estoque dos produtos da venda
export function stockEffect(from: SaleStatus, to: SaleStatus): "decrement" | "increment" | null {
    if (from === "PENDING" && to === "COMPLETED") return "decrement"
    if (from === "COMPLETED" && to === "CANCELLED") return "increment"
    return null
}