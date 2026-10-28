import { registerUser } from "@/_lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, username, email, password } = body

        // Validações
        if (!name || name.trim().length < 3) {
            return NextResponse.json(
                { message: "Nome deve ter pelo menos 3 caracteres" },
                { status: 400 }
            )
        }

        if (!username || username.trim().length < 3) {
            return NextResponse.json(
                { message: "Nome de usuário deve ter pelo menos 3 caracteres" },
                { status: 400 }
            )
        }

        if (!email || !email.includes('@') || !email.includes('.')) {
            return NextResponse.json(
                { message: "E-mail inválido" },
                { status: 400 }
            )
        }

        if (!password || password.length < 6) {
            return NextResponse.json(
                { message: "Senha deve ter pelo menos 6 caracteres" },
                { status: 400 }
            )
        }

        const user = await registerUser(name, username, email, password)

        // Cria resposta com cookie de sessão
        const response = NextResponse.json(
            { 
                ...user,
                message: "Conta criada com sucesso!" 
            }, 
            { status: 201 }
        )
        
        // Define cookie seguro
        response.cookies.set('auth-token', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        })

        return response
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Erro ao criar conta" },
            { status: 400 }
        )
    }
}