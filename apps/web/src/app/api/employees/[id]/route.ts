import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toEmployee } from "@/_lib/serializers"
import { employeeSchema } from "@/_lib/schemas"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params
        const data = await parseBody(req, employeeSchema.partial())

        const db = getDb()
        // updateMany filtra pela empresa: um id de outra empresa não é alterado
        const { count } = await db.employee.updateMany({ where: { id, companyId }, data })
        if (count === 0) throw new HttpError("Colaborador não encontrado", 404)

        const employee = await db.employee.findUniqueOrThrow({ where: { id } })
        return NextResponse.json(toEmployee(employee))
    } catch (error) {
        return handleError(error)
    }
}

// As vendas do colaborador continuam no histórico: cashierId vira null e o nome fica salvo em cashierName
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params

        const { count } = await getDb().employee.deleteMany({ where: { id, companyId } })
        if (count === 0) throw new HttpError("Colaborador não encontrado", 404)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleError(error)
    }
}