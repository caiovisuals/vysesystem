import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { duplicateCodeError } from "@/_lib/products"
import { toProduct } from "@/_lib/serializers"
import { productSchema } from "@/_lib/schemas"
import { contains, paginated, parseListQuery, parseNumericQuery } from "@/_lib/pagination"
import type { Prisma } from "@/generated/prisma/client"

const SORT_FIELDS = ["code", "name", "finalPrice", "unitCost", "quantityInStock", "weight", "createdAt"] as const

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const query = parseListQuery(req, { fields: SORT_FIELDS, default: "code" })
        const code = parseNumericQuery(query.q)

        const where: Prisma.ProductWhereInput = {
            companyId,
            ...(query.q ? {
                OR: [
                    { name: contains(query.q) },
                    ...(code !== null ? [{ code }] : []),
                ],
            } : {}),
        }

        const db = getDb()
        // Com o código exato, a lista é [produto do código, ...demais resultados] em todas as páginas
        const exact = code !== null
            ? await db.product.findUnique({ where: { companyId_code: { companyId, code } } })
            : null
        const rest: Prisma.ProductWhereInput = exact ? { AND: [where, { id: { not: exact.id } }] } : where
        const offset = exact ? 1 : 0

        const [products, total] = await Promise.all([
            db.product.findMany({
                where: rest,
                orderBy: [{ [query.sortBy]: query.order }, { id: "asc" }],
                skip: Math.max(0, query.skip - offset),
                take: query.page === 1 ? query.pageSize - offset : query.pageSize,
            }),
            db.product.count({ where }),
        ])

        const items = exact && query.page === 1 ? [exact, ...products] : products
        return NextResponse.json(paginated(items.map(toProduct), total, query))
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