import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { saleInclude, toSale } from "@/_lib/serializers"
import { createSaleSchema } from "@/_lib/schemas"
import { toCents } from "@/_lib/format"

export async function GET() {
    try {
        const companyId = await requireCompanyId()
        const sales = await getDb().sale.findMany({
            where: { companyId },
            include: saleInclude,
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(sales.map(toSale))
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const data = await parseBody(req, createSaleSchema)

        const sale = await getDb().$transaction(async (tx) => {
            // Preços vêm do banco, nunca do cliente
            const productIds = [...new Set(data.items.map(item => item.productId))]
            const products = await tx.product.findMany({ where: { companyId, id: { in: productIds } } })
            const productById = new Map(products.map(product => [product.id, product]))

            const items = data.items.map(item => {
                const product = productById.get(item.productId)
                if (!product) throw new HttpError("Produto não encontrado", 404)

                const unitPrice = Number(product.finalPrice)
                return {
                    productId: product.id,
                    productName: product.name,
                    quantity: item.quantity,
                    unitPrice,
                    total: toCents(unitPrice * item.quantity),
                }
            })

            const subtotal = toCents(items.reduce((sum, item) => sum + item.total, 0))
            if (data.discount > subtotal) throw new HttpError("Desconto maior que o subtotal", 400)

            const cashier = data.cashierId
                ? await tx.employee.findFirst({ where: { id: data.cashierId, companyId } })
                : null
            if (data.cashierId && !cashier) throw new HttpError("Colaborador não encontrado", 404)

            const customer = data.customerId
                ? await tx.client.findFirst({ where: { id: data.customerId, companyId } })
                : null
            if (data.customerId && !customer) throw new HttpError("Cliente não encontrado", 404)

            // Venda concluída baixa o estoque; o filtro gte evita estoque negativo mesmo com vendas simultâneas
            if (data.status === "COMPLETED") {
                for (const item of items) {
                    const { count } = await tx.product.updateMany({
                        where: { id: item.productId, companyId, quantityInStock: { gte: item.quantity } },
                        data: { quantityInStock: { decrement: item.quantity } },
                    })
                    if (count === 0) throw new HttpError(`Estoque insuficiente para ${item.productName}`, 409)
                }
            }

            return tx.sale.create({
                data: {
                    companyId,
                    subtotal,
                    discount: data.discount,
                    total: toCents(subtotal - data.discount),
                    paymentMethod: data.paymentMethod,
                    status: data.status,
                    cashierId: cashier?.id,
                    cashierName: cashier?.name,
                    customerId: customer?.id,
                    customerName: customer?.name,
                    items: { create: items },
                },
                include: saleInclude,
            })
        })

        return NextResponse.json(toSale(sale), { status: 201 })
    } catch (error) {
        return handleError(error)
    }
}