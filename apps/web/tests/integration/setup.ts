import { afterAll, beforeEach, vi } from "vitest"
import { getDb } from "@/_lib/db"
import { cookieJar } from "./cookies"

// Os testes apagam todas as tabelas: só rodam num banco cujo nome termine em "_test"
const databaseName = new URL(process.env.DATABASE_URL ?? "postgresql://localhost/").pathname.slice(1)
if (!databaseName.endsWith("_test")) {
    throw new Error(`DATABASE_URL precisa apontar para um banco de teste (nome terminando em "_test"); recebido: "${databaseName}"`)
}

// Fora do Next não existe contexto de requisição; as rotas leem os cookies daqui
vi.mock("next/headers", () => ({
    cookies: async () => ({
        get: (name: string) => {
            const value = cookieJar.get(name)
            return value === undefined ? undefined : { name, value }
        },
    }),
}))

beforeEach(async () => {
    cookieJar.clear()
    await getDb().$executeRawUnsafe(`
        TRUNCATE "SaleItem", "Sale", "Product", "Client", "Employee", "Supplier",
            "PasswordResetToken", "User", "Company" CASCADE
    `)
})

afterAll(async () => {
    await getDb().$disconnect()
})