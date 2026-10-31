import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { saleInclude, toSale } from "@/_lib/serializers"
import { createSaleSchema } from "@/_lib/schemas"
import { toCents } from "@/_lib/format"
import { contains, paginated, parseListQuery, parseNumericQuery } from "@/_lib/pagination"
import { saleListFilters } from "@/_lib/sales-query"
import type { Prisma } from "@/generated/prisma/client"

const SORT_FIELDS = ["createdAt", "number", "total", "subtotal", "discount", "customerName", "cashierName", "paymentMethod", "status"] as const

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const query = parseListQuery(req, { fields: SORT_FIELDS, default: "createdAt", order: "desc" })
        const number = parseNumericQuery(query.q)

        const where: Prisma.SaleWhereInput = {
            companyId,
            ...saleListFilters(new URL(req.url).searchParams),
            ...(query.q ? {
                OR: [
                    { customerName: contains(query.q) },
                    { cashierName: contains(query.q) },
                    ...(number !== null ? [{ number }] : []),
                ],
            } : {}),
        }

        const db = getDb()
        const [sales, total] = await Promise.all([
            db.sale.findMany({
                where,
                include: saleInclude,
                orderBy: [{ [query.sortBy]: query.order }, { id: "asc" }],
                skip: query.skip,
                take: query.pageSize,
            }),
            db.sale.count({ where }),
        ])
        return NextResponse.json(paginated(sales.map(toSale), total, query))
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