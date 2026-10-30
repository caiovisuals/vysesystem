import { createHash } from "node:crypto"
import { describe, expect, it } from "vitest"
import { hashPassword, needsRehash, verifyPassword } from "@/_lib/password"

describe("password", () => {
    it("gera hash scrypt com salt e confere a senha certa", async () => {
        const hash = await hashPassword("senha-forte-123")

        expect(hash).toMatch(/^scrypt\$16384\$8\$1\$[^$]+\$[^$]+$/)
        expect(hash).not.toContain("senha-forte-123")
        expect(await verifyPassword("senha-forte-123", hash)).toBe(true)
    })

    it("recusa a senha errada", async () => {
        const hash = await hashPassword("senha-forte-123")
        expect(await verifyPassword("senha-forte-124", hash)).toBe(false)
        expect(await verifyPassword("", hash)).toBe(false)
    })

    it("usa um salt diferente a cada hash", async () => {
        expect(await hashPassword("mesma-senha")).not.toBe(await hashPassword("mesma-senha"))
    })

    it("normaliza Unicode (NFKC) antes de derivar a chave", async () => {
        const hash = await hashPassword("café-senha")
        expect(await verifyPassword("café-senha", hash)).toBe(true)
    })

    it("aceita o formato legado SHA-256 e pede rehash", async () => {
        const legacy = createHash("sha256").update("123456").digest("hex")

        expect(await verifyPassword("123456", legacy)).toBe(true)
        expect(await verifyPassword("1234567", legacy)).toBe(false)
        expect(needsRehash(legacy)).toBe(true)
    })

    it("não pede rehash de hash com os parâmetros atuais", async () => {
        expect(needsRehash(await hashPassword("senha-forte-123"))).toBe(false)
    })

    it("pede rehash quando os parâmetros mudaram", () => {
        expect(needsRehash("scrypt$1024$8$1$c2FsdA==$aGFzaA==")).toBe(true)
    })

    it("recusa hashes em formato desconhecido", async () => {
        expect(await verifyPassword("123456", "")).toBe(false)
        expect(await verifyPassword("123456", "bcrypt$abc")).toBe(false)
        expect(await verifyPassword("123456", "123456")).toBe(false)
    })
})