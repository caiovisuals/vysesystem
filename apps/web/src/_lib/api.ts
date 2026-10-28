import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"

export function jsonError(message: string, status: number, details?: unknown) {
    return NextResponse.json({ message, ...(details ? { details } : {}) }, { status })
}

// Converte erros conhecidos em respostas JSON padronizadas
export function handleError(error: unknown) {
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
