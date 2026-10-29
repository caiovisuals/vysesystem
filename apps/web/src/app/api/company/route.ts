import { NextResponse } from "next/server"
import { getDb } from "@/_lib/db"
import { handleError, parseBody, requireCompanyId } from "@/_lib/api"
import { toCompany } from "@/_lib/serializers"
import { companySchema } from "@/_lib/schemas"

// Atualiza a empresa ativa do usuário logado; o id vem da sessão, nunca do corpo da requisição
export async function PATCH(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const data = await parseBody(req, companySchema.partial())
        const company = await getDb().company.update({ where: { id: companyId }, data })
        return NextResponse.json(toCompany(company))
    } catch (error) {
        return handleError(error)
    }
}