import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toSupplier } from "@/_lib/serializers"
import { supplierSchema } from "@/_lib/schemas"
import { contains, paginated, parseListQuery } from "@/_lib/pagination"
import type { Prisma } from "@/generated/prisma/client"

const SORT_FIELDS = ["name", "cnpj", "email", "phone"] as const

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const query = parseListQuery(req, { fields: SORT_FIELDS, default: "name" })

        const where: Prisma.SupplierWhereInput = {
            companyId,
            ...(query.q ? {
                OR: [
                    { name: contains(query.q) },
                    { cnpj: contains(query.q) },
                    { email: contains(query.q) },
                ],
            } : {}),
        }

        const db = getDb()
        const [suppliers, total] = await Promise.all([
            db.supplier.findMany({
                where,
                orderBy: [{ [query.sortBy]: query.order }, { id: "asc" }],
                skip: query.skip,
                take: query.pageSize,
            }),
            db.supplier.count({ where }),
        ])
        return NextResponse.json(paginated(suppliers.map(toSupplier), total, query))
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const data = await parseBody(req, supplierSchema)
        const supplier = await getDb().supplier.create({ data: { ...data, companyId } })
        return NextResponse.json(toSupplier(supplier), { status: 201 })
    } catch (error) {
        return handleError(error)
    }
}