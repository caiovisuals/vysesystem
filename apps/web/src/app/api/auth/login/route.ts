import { loginUser } from "@/_lib/auth"
import { NextResponse } from "next/server"

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
        response.cookies.set('auth-token', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        })

        return response
    } catch (error: unknown) {
        return NextResponse.json(
            { message: (error instanceof Error && error.message) || "Erro ao fazer login" },
            { status: 401 }
        )
    }
}