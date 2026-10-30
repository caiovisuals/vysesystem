import { NextResponse } from "next/server"
import { createPasswordResetToken } from "@/_lib/auth"
import { handleError, parseBody } from "@/_lib/api"
import { sendPasswordResetEmail } from "@/_lib/mail"
import { forgotPasswordSchema } from "@/_lib/schemas"

// Monta o link a partir de APP_URL; o Host da requisição só é usado fora de produção,
// porque um Host forjado faria o e-mail apontar para outro site
function getAppUrl(req: Request): string {
    if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "")
    if (process.env.NODE_ENV !== "production") return new URL(req.url).origin
    throw new Error("APP_URL não definida: necessária para montar o link de recuperação de senha")
}

// Envia um link com token de uso único para o e-mail da conta. A resposta é sempre a mesma,
// exista ou não a conta, para não revelar quais usuários estão cadastrados.
export async function POST(req: Request) {
    try {
        const { username, email } = await parseBody(req, forgotPasswordSchema)

        const reset = await createPasswordResetToken(username, email)
        if (reset) {
            const url = `${getAppUrl(req)}/reset-password?token=${encodeURIComponent(reset.token)}`
            await sendPasswordResetEmail(reset.email, url)
        }

        return NextResponse.json({
            success: true,
            message: "Se os dados estiverem corretos, enviamos um link para redefinir a senha no seu e-mail.",
        })
    } catch (error) {
        return handleError(error)
    }
}