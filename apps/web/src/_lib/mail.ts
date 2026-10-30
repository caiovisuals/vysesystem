import "server-only"

// Ainda não há provedor de e-mail configurado. Em desenvolvimento o link aparece no terminal do
// `npm run dev`; em produção nada é enviado até um provedor (Resend, SES, SMTP...) ser ligado aqui.
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
        console.info(`[MAIL] Recuperação de senha para ${to}: ${resetUrl}`)
        return
    }

    console.warn("[MAIL] Nenhum provedor de e-mail configurado; o link de recuperação de senha não foi enviado.")
}