import "server-only"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getUserFromSession } from "@/_lib/auth"
import { HttpError } from "@/_lib/errors"
import { SESSION_COOKIE } from "@/_lib/session"
export { HttpError }

export function jsonError(message: string, status: number, details?: unknown) {
    return NextResponse.json({ message, ...(details ? { details } : {}) }, { status })
}

// Converte erros conhecidos em respostas JSON padronizadas
export function handleError(error: unknown) {
    if (error instanceof HttpError) {
        return jsonError(error.message, error.status)
    }
    if (error instanceof z.ZodError) {
        return jsonError(error.issues[0]?.message ?? "Dados inválidos", 400, z.flattenError(error).fieldErrors)
    }
    if (error instanceof SyntaxError) {
        return jsonError("Corpo da requisição inválido", 400)
    }
    console.error("[API]", error)
    return jsonError("Erro interno do servidor", 500)
}

export async function parseBody<T extends z.ZodType>(req: Request, schema: T): Promise<z.output<T>> {
    return schema.parse(await req.json())
}

// Empresa ativa do usuário logado; todos os dados do painel são filtrados por ela
export async function requireCompanyId(): Promise<string> {
    const cookieStore = await cookies()
    const user = await getUserFromSession(cookieStore.get(SESSION_COOKIE)?.value)

    if (!user) throw new HttpError("Não autenticado", 401)
    if (!user.activeCompanyId) throw new HttpError("Nenhuma empresa ativa selecionada", 400)

    return user.activeCompanyId
}
