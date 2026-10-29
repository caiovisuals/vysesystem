import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { HttpError, handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toClient } from "@/_lib/serializers"
import { clientSchema } from "@/_lib/schemas"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const companyId = await requireCompanyId()
        const { id } = await params
        const data = await parseBody(req, clientSchema.partial())

        const db = getDb()
        // updateMany filtra pela empresa: um id de outra empresa não é alterado
        const { count } = await db.client.updateMany({ where: { id, companyId }, data })
        if (count === 0) throw new HttpError("Cliente não encontrado", 404)

        const client = await db.client.findUniqueOrThrow({ where: { id } })
        return NextResponse.json(toClient(client))
    } catch (error) {
        return handleError(error)
    }
}