import "server-only"
import { createHash, randomBytes } from "node:crypto"
import { PublicUser } from "@vysesystem/types"
import { Prisma } from "@/generated/prisma/client"
import { getDb } from "@/_lib/db"
import { HttpError } from "@/_lib/errors"
import { hashPassword, verifyPassword, needsRehash } from "@/_lib/password"
import { verifySessionToken } from "@/_lib/session"
import { toCompany } from "@/_lib/serializers"

const userInclude = { companies: { orderBy: { createdAt: "asc" } } } satisfies Prisma.UserInclude

type UserWithCompanies = Prisma.UserGetPayload<{ include: typeof userInclude }>

function toPublicUser(user: UserWithCompanies): PublicUser {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image ?? undefined,
        companies: user.companies.map(toCompany),
        activeCompanyId: user.activeCompanyId,
        sessionVersion: user.sessionVersion,
    }
}

// Mesma mensagem para usuário inexistente e senha errada: não revela quais usuários existem
const INVALID_CREDENTIALS = "Usuário ou senha inválidos"

// Contas antigas podem ter maiúsculas no username; a busca ignora a caixa para continuarem entrando
function usernameEquals(username: string) {
    return { equals: username, mode: "insensitive" } satisfies Prisma.StringFilter
}

export async function registerUser(data: {
    name: string
    username: string
    email: string
    password: string
}): Promise<PublicUser> {
    const db = getDb()

    const existing = await db.user.findFirst({
        where: { OR: [{ username: usernameEquals(data.username) }, { email: data.email }] },
        select: { username: true },
    })
    if (existing) {
        throw new HttpError(
            existing.username.toLowerCase() === data.username ? "Nome de usuário já está em uso" : "E-mail já está em uso",
            409,
        )
    }

    const password = await hashPassword(data.password)

    try {
        // Toda conta nova já nasce com uma empresa ativa, senão o painel não tem onde guardar os dados
        const user = await db.$transaction(async (tx) => {
            const company = await tx.company.create({ data: { name: `Empresa de ${data.name}` } })
            return tx.user.create({
                data: {
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password,
                    activeCompanyId: company.id,
                    companies: { connect: { id: company.id } },
                },
                include: userInclude,
            })
        })
        return toPublicUser(user)
    } catch (error) {
        // Cadastro simultâneo com o mesmo usuário/e-mail cai na restrição unique do banco
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new HttpError("Usuário ou e-mail já está em uso", 409)
        }
        throw error
    }
}

export async function loginUser(username: string, password: string): Promise<PublicUser> {
    const db = getDb()
    const user = await db.user.findFirst({
        where: { username: usernameEquals(username) },
        orderBy: { createdAt: "asc" },
        include: userInclude,
    })

    if (!user || !(await verifyPassword(password, user.password))) {
        throw new HttpError(INVALID_CREDENTIALS, 401)
    }

    if (needsRehash(user.password)) {
        await db.user.update({ where: { id: user.id }, data: { password: await hashPassword(password) } })
    }

    return toPublicUser(user)
}

export async function getUserFromSession(token: string | undefined): Promise<PublicUser | null> {
    const session = await verifySessionToken(token)
    if (!session) return null

    const user = await getDb().user.findUnique({ where: { id: session.sub }, include: userInclude })
    // Trocar a senha incrementa sessionVersion e invalida os tokens antigos
    if (!user || user.sessionVersion !== session.ver) return null

    return toPublicUser(user)
}

// Logout: incrementar sessionVersion invalida o token atual (e os de outros dispositivos), mesmo que alguém tenha copiado o cookie
export async function revokeSessions(token: string | undefined): Promise<void> {
    const session = await verifySessionToken(token)
    if (!session) return

    await getDb().user.updateMany({
        where: { id: session.sub, sessionVersion: session.ver },
        data: { sessionVersion: { increment: 1 } },
    })
}

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000 // 30 minutos

export function hashResetToken(token: string): string {
    return createHash("sha256").update(token).digest("hex")
}

// Gera um token de recuperação para a conta, se usuário e e-mail baterem. Retorna o token em texto
// (para montar o link do e-mail) ou null; quem chama não deve revelar ao usuário qual dos dois aconteceu.
export async function createPasswordResetToken(username: string, email: string): Promise<{ token: string, email: string } | null> {
    const db = getDb()
    const user = await db.user.findFirst({
        where: { username: usernameEquals(username), email },
        select: { id: true, email: true },
    })
    if (!user) return null

    const token = randomBytes(32).toString("base64url")

    // Só o link mais recente vale
    await db.$transaction([
        db.passwordResetToken.deleteMany({ where: { userId: user.id } }),
        db.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash: hashResetToken(token),
                expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
            },
        }),
    ])

    return { token, email: user.email }
}

const INVALID_RESET_TOKEN = "Link de recuperação inválido ou expirado. Solicite um novo."

export async function resetPasswordWithToken(token: string, newPassword: string) {
    const password = await hashPassword(newPassword)

    await getDb().$transaction(async (tx) => {
        const resetToken = await tx.passwordResetToken.findUnique({ where: { tokenHash: hashResetToken(token) } })
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
            throw new HttpError(INVALID_RESET_TOKEN, 400)
        }

        // O filtro usedAt: null garante uso único mesmo com duas requisições simultâneas
        const { count } = await tx.passwordResetToken.updateMany({
            where: { id: resetToken.id, usedAt: null },
            data: { usedAt: new Date() },
        })
        if (count === 0) throw new HttpError(INVALID_RESET_TOKEN, 400)

        // Incrementar sessionVersion derruba as sessões abertas com a senha antiga
        await tx.user.update({
            where: { id: resetToken.userId },
            data: { password, sessionVersion: { increment: 1 } },
        })
    })

    return { success: true, message: "Senha alterada com sucesso" }
}