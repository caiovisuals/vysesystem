import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toSupplier } from "@/_lib/serializers"
import { supplierSchema } from "@/_lib/schemas"

export async function GET() {
    try {
        const companyId = await requireCompanyId()
        const suppliers = await getDb().supplier.findMany({
            where: { companyId },
            orderBy: { name: "asc" },
        })
        return NextResponse.json(suppliers.map(toSupplier))
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