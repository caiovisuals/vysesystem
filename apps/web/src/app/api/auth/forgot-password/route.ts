import { verifyUserCredentials, resetPassword } from "@/_lib/auth"
import { NextResponse } from "next/server"

// Verifica se o usuário existe
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, email, newPassword, step } = body

        // Step 1: Verificar credenciais
        if (step === 'verify') {
            if (!username || !email) {
                return NextResponse.json(
                    { message: "Usuário e e-mail são obrigatórios" },
                    { status: 400 }
                )
            }

            const userExists = verifyUserCredentials(username, email)

            if (!userExists) {
                return NextResponse.json(
                    { message: "Usuário não encontrado com essas credenciais" },
                    { status: 404 }
                )
            }

            // Em produção, enviar e-mail com token
            // Por enquanto, retorna sucesso direto
            return NextResponse.json({
                success: true,
                message: "Usuário verificado. Defina sua nova senha.",
                canResetPassword: true
            })
        }

        // Step 2: Resetar senha
        if (step === 'reset') {
            if (!username || !email || !newPassword) {
                return NextResponse.json(
                    { message: "Todos os campos são obrigatórios" },
                    { status: 400 }
                )
            }

            if (newPassword.length < 6) {
                return NextResponse.json(
                    { message: "Nova senha deve ter pelo menos 6 caracteres" },
                    { status: 400 }
                )
            }

            const result = await resetPassword(username, email, newPassword)

            return NextResponse.json(result)
        }

        return NextResponse.json(
            { message: "Passo inválido" },
            { status: 400 }
        )
    } catch (error: unknown) {
        return NextResponse.json(
            { message: (error instanceof Error && error.message) || "Erro ao processar solicitação" },
            { status: 400 }
        )
    }
}