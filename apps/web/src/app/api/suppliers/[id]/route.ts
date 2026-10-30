import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toSupplier } from "@/_lib/serializers"
import { supplierSchema } from "@/_lib/schemas"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params
        const data = await parseBody(req, supplierSchema.partial())

        const db = getDb()
        // updateMany filtra pela empresa: um id de outra empresa não é alterado
        const { count } = await db.supplier.updateMany({ where: { id, companyId }, data })
        if (count === 0) throw new HttpError("Fornecedor não encontrado", 404)

        const supplier = await db.supplier.findUniqueOrThrow({ where: { id } })
        return NextResponse.json(toSupplier(supplier))
    } catch (error) {
        return handleError(error)
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params

        const { count } = await getDb().supplier.deleteMany({ where: { id, companyId } })
        if (count === 0) throw new HttpError("Fornecedor não encontrado", 404)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleError(error)
    }
}