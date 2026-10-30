import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { duplicateCodeError } from "@/_lib/products"
import { toProduct } from "@/_lib/serializers"
import { productSchema } from "@/_lib/schemas"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params
        const data = await parseBody(req, productSchema.partial())

        const db = getDb()
        try {
            // updateMany filtra pela empresa: um id de outra empresa não é alterado
            const { count } = await db.product.updateMany({ where: { id, companyId }, data })
            if (count === 0) throw new HttpError("Produto não encontrado", 404)
        } catch (error) {
            throw duplicateCodeError(error)
        }

        const product = await db.product.findUniqueOrThrow({ where: { id } })
        return NextResponse.json(toProduct(product))
    } catch (error) {
        return handleError(error)
    }
}

// Os itens de vendas antigas continuam no histórico: productId vira null e o nome fica salvo em productName
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params

        const { count } = await getDb().product.deleteMany({ where: { id, companyId } })
        if (count === 0) throw new HttpError("Produto não encontrado", 404)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleError(error)
    }
}