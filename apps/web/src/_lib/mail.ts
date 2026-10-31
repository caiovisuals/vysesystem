import "server-only"

// Envio de e-mails pela API HTTP do Resend (https://resend.com/docs/api-reference/emails/send-email).
// Com RESEND_API_KEY e MAIL_FROM definidas o e-mail é enviado em qualquer ambiente. Sem elas, em
// desenvolvimento o link aparece no terminal do `npm run dev`; em produção nada é enviado.

const RESEND_ENDPOINT = "https://api.resend.com/emails"
const TIMEOUT_MS = 10_000

type Mail = {
    to: string
    subject: string
    html: string
    text: string
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

// Retorna false quando não há provedor configurado
async function sendMail(mail: Mail): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.MAIL_FROM
    if (!apiKey || !from) return false

    const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, html: mail.html, text: mail.text }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (!res.ok) {
        const detail = await res.text().catch(() => "")
        throw new Error(`Resend respondeu ${res.status}: ${detail.slice(0, 300)}`)
    }
    return true
}

// Falhas de envio só são registradas no log: a rota responde igual exista ou não a conta, e um
// erro aqui revelaria que o usuário existe.
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const url = escapeHtml(resetUrl)
    const mail: Mail = {
        to,
        subject: "Redefinição de senha - VyseSystem",
        text: [
            "Recebemos um pedido para redefinir a senha da sua conta no VyseSystem.",
            "",
            `Abra o link abaixo para criar uma nova senha (válido por 30 minutos):`,
            resetUrl,
            "",
            "Se não foi você, ignore este e-mail: sua senha continua a mesma.",
        ].join("\n"),
        html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#131313">
    <p>Recebemos um pedido para redefinir a senha da sua conta no <strong>VyseSystem</strong>.</p>
    <p><a href="${url}" style="display:inline-block;padding:10px 18px;background:#131313;color:#ffffff;text-decoration:none;border-radius:10px">Criar nova senha</a></p>
    <p>O link vale por 30 minutos. Se o botão não funcionar, copie e cole no navegador:<br><span style="word-break:break-all">${url}</span></p>
    <p style="color:#666">Se não foi você, ignore este e-mail: sua senha continua a mesma.</p>
</div>`,
    }

    try {
        if (await sendMail(mail)) return
    } catch (error) {
        console.error("[MAIL] Falha ao enviar o e-mail de recuperação de senha:", error)
        return
    }

    if (process.env.NODE_ENV !== "production") {
        console.info(`[MAIL] Recuperação de senha para ${to}: ${resetUrl}`)
        return
    }

    console.warn("[MAIL] RESEND_API_KEY/MAIL_FROM não definidas; o link de recuperação de senha não foi enviado.")
}