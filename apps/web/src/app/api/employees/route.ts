import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toEmployee } from "@/_lib/serializers"
import { employeeSchema } from "@/_lib/schemas"

export async function GET() {
    try {
        const companyId = await requireCompanyId()
        const employees = await getDb().employee.findMany({
            where: { companyId },
            orderBy: { name: "asc" },
        })
        return NextResponse.json(employees.map(toEmployee))
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const data = await parseBody(req, employeeSchema)
        const employee = await getDb().employee.create({ data: { ...data, companyId } })
        return NextResponse.json(toEmployee(employee), { status: 201 })
    } catch (error) {
        return handleError(error)
    }
}