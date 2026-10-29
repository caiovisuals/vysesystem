import { NextResponse } from "next/server"
import { resetPassword, verifyUserCredentials } from "@/_lib/auth"
import { HttpError, handleError, parseBody } from "@/_lib/api"
import { forgotPasswordSchema } from "@/_lib/schemas"

// Fluxo em dois passos: "verify" confere usuário + e-mail e "reset" grava a nova senha.
// Em produção o passo "verify" deveria enviar um link com token por e-mail em vez de liberar a troca direto.
export async function POST(req: Request) {
    try {
        const body = await parseBody(req, forgotPasswordSchema)

        if (body.step === "verify") {
            if (!(await verifyUserCredentials(body.username, body.email))) {
                throw new HttpError("Usuário não encontrado com essas credenciais", 404)
            }

            return NextResponse.json({
                success: true,
                message: "Usuário verificado. Defina sua nova senha.",
                canResetPassword: true,
            })
        }

        return NextResponse.json(await resetPassword(body.username, body.email, body.newPassword))
    } catch (error) {
        return handleError(error)
    }
}