import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toClient } from "@/_lib/serializers"
import { clientSchema } from "@/_lib/schemas"
import { contains, paginated, parseListQuery } from "@/_lib/pagination"
import type { Prisma } from "@/generated/prisma/client"

const SORT_FIELDS = ["name", "tag", "address", "neighborhood", "email", "phone", "createdAt"] as const

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const query = parseListQuery(req, { fields: SORT_FIELDS, default: "name" })
        const tag = new URL(req.url).searchParams.get("tag")?.trim()

        const where: Prisma.ClientWhereInput = {
            companyId,
            ...(tag ? { tag } : {}),
            ...(query.q ? {
                OR: [
                    { name: contains(query.q) },
                    { email: contains(query.q) },
                    { phone: contains(query.q) },
                    { cpf: contains(query.q) },
                    { cnpj: contains(query.q) },
                ],
            } : {}),
        }

        const db = getDb()
        const [clients, total] = await Promise.all([
            db.client.findMany({
                where,
                orderBy: [{ [query.sortBy]: query.order }, { id: "asc" }],
                skip: query.skip,
                take: query.pageSize,
            }),
            db.client.count({ where }),
        ])
        return NextResponse.json(paginated(clients.map(toClient), total, query))
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const data = await parseBody(req, clientSchema)
        const client = await getDb().client.create({ data: { ...data, companyId } })
        return NextResponse.json(toClient(client), { status: 201 })
    } catch (error) {
        return handleError(error)
    }
}