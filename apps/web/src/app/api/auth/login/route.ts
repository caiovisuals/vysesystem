import { loginUser } from "@/_lib/auth"
import { NextResponse } from "next/server"
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/_lib/session"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, password } = body

        // Validações básicas
        if (!username || !password) {
            return NextResponse.json(
                { message: "Usuário e senha são obrigatórios" },
                { status: 400 }
            )
        }

        const user = await loginUser(username, password)

        // Cria resposta com cookie de sessão
        const response = NextResponse.json(user)
        
        // Define cookie seguro (httpOnly para prevenir XSS)
        response.cookies.set(
            SESSION_COOKIE,
            await createSessionToken(user.id, user.sessionVersion ?? 0),
            sessionCookieOptions
        )

        return response
    } catch (error: unknown) {
        return NextResponse.json(
            { message: (error instanceof Error && error.message) || "Erro ao fazer login" },
            { status: 401 }
        )
    }
}