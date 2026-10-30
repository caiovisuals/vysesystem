import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { duplicateCodeError } from "@/_lib/products"
import { toProduct } from "@/_lib/serializers"
import { productSchema } from "@/_lib/schemas"

export async function GET() {
    try {
        const companyId = await requireCompanyId()
        const products = await getDb().product.findMany({
            where: { companyId },
            orderBy: { code: "asc" },
        })
        return NextResponse.json(products.map(toProduct))
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const { code, ...data } = await parseBody(req, productSchema)
        const db = getDb()

        // Sem código informado, usa o próximo número depois do maior código da empresa
        const nextCode = code ?? ((await db.product.aggregate({ where: { companyId }, _max: { code: true } }))._max.code ?? 0) + 1

        try {
            const product = await db.product.create({ data: { ...data, code: nextCode, companyId } })
            return NextResponse.json(toProduct(product), { status: 201 })
        } catch (error) {
            throw duplicateCodeError(error)
        }
    } catch (error) {
        return handleError(error)
    }
}