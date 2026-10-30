import { getDb } from "@/_lib/db"
import { hashPassword } from "@/_lib/password"
import { SESSION_COOKIE, createSessionToken } from "@/_lib/session"
import { cookieJar } from "./cookies"

export function jsonRequest(url: string, body: unknown, method = "POST"): Request {
    return new Request(`http://localhost:3000${url}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
}

export function routeParams(id: string) {
    return { params: Promise.resolve({ id }) }
}

// Usuário com uma empresa ativa, como o cadastro cria
export async function createUser(overrides: { username?: string, email?: string, password?: string } = {}) {
    const db = getDb()
    const company = await db.company.create({ data: { name: "Empresa Teste" } })
    const user = await db.user.create({
        data: {
            name: "Usuário Teste",
            username: overrides.username ?? "teste",
            email: overrides.email ?? "teste@exemplo.com",
            password: await hashPassword(overrides.password ?? "senha-antiga-123"),
            activeCompanyId: company.id,
            companies: { connect: { id: company.id } },
        },
    })
    return { user, company }
}

// Coloca o cookie de sessão no "navegador" simulado e devolve o token
export async function signIn(userId: string, sessionVersion = 0): Promise<string> {
    const token = await createSessionToken(userId, sessionVersion)
    cookieJar.set(SESSION_COOKIE, token)
    return token
}