import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toEmployee } from "@/_lib/serializers"
import { employeeSchema } from "@/_lib/schemas"
import { contains, paginated, parseListQuery } from "@/_lib/pagination"
import type { Prisma } from "@/generated/prisma/client"

const SORT_FIELDS = ["name", "email", "role", "salary", "hireDate", "workShift"] as const

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const query = parseListQuery(req, { fields: SORT_FIELDS, default: "name" })

        const where: Prisma.EmployeeWhereInput = {
            companyId,
            ...(query.q ? {
                OR: [
                    { name: contains(query.q) },
                    { email: contains(query.q) },
                    { role: contains(query.q) },
                ],
            } : {}),
        }

        const db = getDb()
        const [employees, total] = await Promise.all([
            db.employee.findMany({
                where,
                orderBy: [{ [query.sortBy]: query.order }, { id: "asc" }],
                skip: query.skip,
                take: query.pageSize,
            }),
            db.employee.count({ where }),
        ])
        return NextResponse.json(paginated(employees.map(toEmployee), total, query))
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