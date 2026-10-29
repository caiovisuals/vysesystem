import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toClient } from "@/_lib/serializers"
import { clientSchema } from "@/_lib/schemas"

export async function GET() {
    try {
        const companyId = await requireCompanyId()
        const clients = await getDb().client.findMany({
            where: { companyId },
            orderBy: { name: "asc" },
        })
        return NextResponse.json(clients.map(toClient))
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