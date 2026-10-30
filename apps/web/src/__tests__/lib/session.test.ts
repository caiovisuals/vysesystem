import { afterEach, describe, expect, it, vi } from "vitest"
import { SESSION_MAX_AGE, createSessionToken, verifySessionToken } from "@/_lib/session"

// Troca um caractere no meio, mantendo o base64url válido
function tamper(value: string): string {
    const i = Math.floor(value.length / 2)
    return value.slice(0, i) + (value[i] === "A" ? "B" : "A") + value.slice(i + 1)
}

describe("session", () => {
    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllEnvs()
        vi.resetModules()
    })

    it("cria um token que verifica com o id e a versão da sessão", async () => {
        const token = await createSessionToken("user-1", 3)
        const payload = await verifySessionToken(token)

        expect(payload).toMatchObject({ sub: "user-1", ver: 3 })
        expect(payload!.exp).toBeGreaterThan(Date.now())
    })

    it("rejeita token ausente ou malformado", async () => {
        expect(await verifySessionToken(undefined)).toBeNull()
        expect(await verifySessionToken("")).toBeNull()
        expect(await verifySessionToken("sem-ponto")).toBeNull()
        expect(await verifySessionToken("a.b.c")).toBeNull()
        expect(await verifySessionToken("%%%.%%%")).toBeNull()
    })

    it("rejeita payload alterado", async () => {
        const [payload, signature] = (await createSessionToken("user-1")).split(".")
        expect(await verifySessionToken(`${tamper(payload)}.${signature}`)).toBeNull()
    })

    it("rejeita payload trocado por outro usuário com a assinatura original", async () => {
        const [, signature] = (await createSessionToken("user-1")).split(".")
        const forged = Buffer.from(JSON.stringify({ sub: "admin", ver: 0, exp: Date.now() + 60_000 })).toString("base64url")
        expect(await verifySessionToken(`${forged}.${signature}`)).toBeNull()
    })

    it("rejeita assinatura alterada", async () => {
        const [payload, signature] = (await createSessionToken("user-1")).split(".")
        expect(await verifySessionToken(`${payload}.${tamper(signature)}`)).toBeNull()
    })

    it("expira depois de SESSION_MAX_AGE", async () => {
        vi.useFakeTimers()
        const token = await createSessionToken("user-1")

        vi.advanceTimersByTime(SESSION_MAX_AGE * 1000 - 1000)
        expect(await verifySessionToken(token)).not.toBeNull()

        vi.advanceTimersByTime(2000)
        expect(await verifySessionToken(token)).toBeNull()
    })

    it("tokens assinados com outra chave não valem", async () => {
        const token = await createSessionToken("user-1")

        vi.resetModules()
        vi.stubEnv("AUTH_SECRET", "x".repeat(64))
        const session = await import("@/_lib/session")

        expect(await session.verifySessionToken(token)).toBeNull()
    })

    it("exige AUTH_SECRET em produção", async () => {
        vi.resetModules()
        vi.stubEnv("NODE_ENV", "production")
        vi.stubEnv("AUTH_SECRET", "curta")
        const session = await import("@/_lib/session")

        await expect(session.createSessionToken("user-1")).rejects.toThrow(/AUTH_SECRET/)
    })
})