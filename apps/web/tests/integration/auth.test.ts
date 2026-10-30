import { beforeEach, describe, expect, it, vi } from "vitest"
import { getUserFromSession, hashResetToken, RESET_TOKEN_TTL_MS } from "@/_lib/auth"
import { getDb } from "@/_lib/db"
import { sendPasswordResetEmail } from "@/_lib/mail"
import { SESSION_COOKIE } from "@/_lib/session"
import { POST as forgotPassword } from "@/app/api/auth/forgot-password/route"
import { POST as login } from "@/app/api/auth/login/route"
import { POST as logout } from "@/app/api/auth/logout/route"
import { POST as register } from "@/app/api/auth/register/route"
import { POST as resetPassword } from "@/app/api/auth/reset-password/route"
import { createUser, jsonRequest, signIn } from "./helpers"

vi.mock("@/_lib/mail", () => ({ sendPasswordResetEmail: vi.fn() }))

const sendMail = vi.mocked(sendPasswordResetEmail)

// Pede o link de recuperação e devolve o token que iria no e-mail
async function requestResetToken(username = "teste", email = "teste@exemplo.com"): Promise<string> {
    const res = await forgotPassword(jsonRequest("/api/auth/forgot-password", { username, email }))
    expect(res.status).toBe(200)
    expect(sendMail).toHaveBeenCalledTimes(1)
    const url = new URL(sendMail.mock.calls[0][1])
    sendMail.mockClear()
    return url.searchParams.get("token")!
}

beforeEach(() => {
    sendMail.mockClear()
})

describe("cadastro e login", () => {
    it("salva o username em minúsculas e aceita login com qualquer caixa", async () => {
        const res = await register(jsonRequest("/api/auth/register", {
            name: "Caio Oliveira", username: "  Caio ", email: "Caio@Exemplo.com", password: "12345678",
        }))
        expect(res.status).toBe(201)

        const user = await getDb().user.findFirstOrThrow()
        expect(user.username).toBe("caio")
        expect(user.email).toBe("caio@exemplo.com")

        expect((await login(jsonRequest("/api/auth/login", { username: "CAIO", password: "12345678" }))).status).toBe(200)
    })

    it("não deixa cadastrar o mesmo username com outra caixa", async () => {
        await createUser({ username: "Caio" }) // conta antiga, de antes da normalização
        const res = await register(jsonRequest("/api/auth/register", {
            name: "Outro Caio", username: "caio", email: "outro@exemplo.com", password: "12345678",
        }))
        expect(res.status).toBe(409)
    })

    it("contas antigas com maiúsculas continuam entrando", async () => {
        await createUser({ username: "Caio", password: "senha-antiga-123" })
        const res = await login(jsonRequest("/api/auth/login", { username: "caio", password: "senha-antiga-123" }))
        expect(res.status).toBe(200)
    })

    it("recusa senha com menos de 8 caracteres no cadastro", async () => {
        const res = await register(jsonRequest("/api/auth/register", {
            name: "Caio Oliveira", username: "caio", email: "caio@exemplo.com", password: "1234567",
        }))
        expect(res.status).toBe(400)
    })
})

describe("logout", () => {
    it("invalida no servidor o token que estava no cookie", async () => {
        const { user } = await createUser()
        const token = await signIn(user.id)
        expect(await getUserFromSession(token)).not.toBeNull()

        const res = await logout()
        expect(res.status).toBe(200)
        expect(res.cookies.get(SESSION_COOKIE)?.value).toBe("")

        // Um token copiado antes do logout não serve mais
        expect(await getUserFromSession(token)).toBeNull()
    })

    it("funciona sem sessão", async () => {
        expect((await logout()).status).toBe(200)
    })
})

describe("recuperação de senha", () => {
    it("responde igual exista ou não a conta, e só envia e-mail para conta real", async () => {
        await createUser()

        const unknown = await forgotPassword(jsonRequest("/api/auth/forgot-password", { username: "ninguem", email: "x@exemplo.com" }))
        const wrongEmail = await forgotPassword(jsonRequest("/api/auth/forgot-password", { username: "teste", email: "x@exemplo.com" }))
        expect(sendMail).not.toHaveBeenCalled()

        const known = await forgotPassword(jsonRequest("/api/auth/forgot-password", { username: "TESTE", email: "teste@exemplo.com" }))
        expect(sendMail).toHaveBeenCalledWith("teste@exemplo.com", expect.stringContaining("/reset-password?token="))

        const bodies = await Promise.all([unknown, wrongEmail, known].map(res => res.json()))
        expect(new Set(bodies.map(body => JSON.stringify(body))).size).toBe(1)
    })

    it("não troca a senha só com usuário e e-mail (fluxo antigo)", async () => {
        await createUser()
        const res = await forgotPassword(jsonRequest("/api/auth/forgot-password", {
            step: "reset", username: "teste", email: "teste@exemplo.com", newPassword: "senha-do-atacante",
        }))
        expect(res.status).toBe(200)

        const reset = await resetPassword(jsonRequest("/api/auth/reset-password", {
            username: "teste", email: "teste@exemplo.com", newPassword: "senha-do-atacante",
        }))
        expect(reset.status).toBe(400)

        const loginRes = await login(jsonRequest("/api/auth/login", { username: "teste", password: "senha-antiga-123" }))
        expect(loginRes.status).toBe(200)
    })

    it("guarda só o hash do token no banco", async () => {
        await createUser()
        const token = await requestResetToken()

        const stored = await getDb().passwordResetToken.findFirstOrThrow()
        expect(stored.tokenHash).toBe(hashResetToken(token))
        expect(stored.tokenHash).not.toBe(token)
    })

    it("troca a senha com o token, derruba as sessões abertas e não aceita o token de novo", async () => {
        const { user } = await createUser()
        const oldSession = await signIn(user.id)
        const token = await requestResetToken()

        const res = await resetPassword(jsonRequest("/api/auth/reset-password", { token, newPassword: "senha-nova-123" }))
        expect(res.status).toBe(200)

        expect(await getUserFromSession(oldSession)).toBeNull()
        expect((await login(jsonRequest("/api/auth/login", { username: "teste", password: "senha-antiga-123" }))).status).toBe(401)
        expect((await login(jsonRequest("/api/auth/login", { username: "teste", password: "senha-nova-123" }))).status).toBe(200)

        const reuse = await resetPassword(jsonRequest("/api/auth/reset-password", { token, newPassword: "outra-senha-123" }))
        expect(reuse.status).toBe(400)
    })

    it("recusa token expirado", async () => {
        await createUser()
        const token = await requestResetToken()
        await getDb().passwordResetToken.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } })

        const res = await resetPassword(jsonRequest("/api/auth/reset-password", { token, newPassword: "senha-nova-123" }))
        expect(res.status).toBe(400)
    })

    it("o link vale por 30 minutos", async () => {
        await createUser()
        const before = Date.now()
        await requestResetToken()

        const { expiresAt } = await getDb().passwordResetToken.findFirstOrThrow()
        expect(expiresAt.getTime() - before).toBeGreaterThanOrEqual(RESET_TOKEN_TTL_MS - 1000)
        expect(expiresAt.getTime() - before).toBeLessThanOrEqual(RESET_TOKEN_TTL_MS + 1000)
    })

    it("pedir um novo link invalida o anterior", async () => {
        await createUser()
        const first = await requestResetToken()
        const second = await requestResetToken()

        expect((await resetPassword(jsonRequest("/api/auth/reset-password", { token: first, newPassword: "senha-nova-123" }))).status).toBe(400)
        expect((await resetPassword(jsonRequest("/api/auth/reset-password", { token: second, newPassword: "senha-nova-123" }))).status).toBe(200)
    })

    it("recusa token inventado e senha curta", async () => {
        await createUser()
        const token = await requestResetToken()

        expect((await resetPassword(jsonRequest("/api/auth/reset-password", { token: "inventado", newPassword: "senha-nova-123" }))).status).toBe(400)
        expect((await resetPassword(jsonRequest("/api/auth/reset-password", { token, newPassword: "curta" }))).status).toBe(400)
    })
})