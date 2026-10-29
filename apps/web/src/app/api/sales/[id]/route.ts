import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { saleInclude, toSale } from "@/_lib/serializers"
import { updateSaleStatusSchema } from "@/_lib/schemas"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params

        const sale = await getDb().sale.findFirst({ where: { id, companyId }, include: saleInclude })
        if (!sale) throw new HttpError("Venda não encontrada", 404)

        return NextResponse.json(toSale(sale))
    } catch (error) {
        return handleError(error)
    }
}

// Transições permitidas: PENDING → COMPLETED (baixa estoque), PENDING → CANCELLED e COMPLETED → CANCELLED (devolve estoque)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params
        const { status } = await parseBody(req, updateSaleStatusSchema)

        const sale = await getDb().$transaction(async (tx) => {
            const current = await tx.sale.findFirst({ where: { id, companyId }, include: { items: true } })
            if (!current) throw new HttpError("Venda não encontrada", 404)
            if (current.status === status) return tx.sale.findUniqueOrThrow({ where: { id }, include: saleInclude })

            const allowed = (current.status === "PENDING" && status !== "PENDING") ||
                (current.status === "COMPLETED" && status === "CANCELLED")
            if (!allowed) throw new HttpError("Não é possível alterar o status desta venda", 409)

            // Itens de produtos já excluídos (productId nulo) não mexem no estoque
            const stockItems = current.items.filter(item => item.productId !== null)

            if (status === "COMPLETED") {
                for (const item of stockItems) {
                    const { count } = await tx.product.updateMany({
                        where: { id: item.productId!, companyId, quantityInStock: { gte: item.quantity } },
                        data: { quantityInStock: { decrement: item.quantity } },
                    })
                    if (count === 0) throw new HttpError(`Estoque insuficiente para ${item.productName}`, 409)
                }
            }

            if (current.status === "COMPLETED" && status === "CANCELLED") {
                for (const item of stockItems) {
                    await tx.product.updateMany({
                        where: { id: item.productId!, companyId },
                        data: { quantityInStock: { increment: item.quantity } },
                    })
                }
            }

            return tx.sale.update({ where: { id }, data: { status }, include: saleInclude })
        })

        return NextResponse.json(toSale(sale))
    } catch (error) {
        return handleError(error)
    }
}