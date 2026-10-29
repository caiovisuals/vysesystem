import "server-only"
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

export async function registerUser(data: {
    name: string
    username: string
    email: string
    password: string
}): Promise<PublicUser> {
    const db = getDb()

    const existing = await db.user.findFirst({
        where: { OR: [{ username: data.username }, { email: data.email }] },
        select: { username: true },
    })
    if (existing) {
        throw new HttpError(
            existing.username === data.username ? "Nome de usuário já está em uso" : "E-mail já está em uso",
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
    const user = await db.user.findUnique({ where: { username }, include: userInclude })

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

export async function verifyUserCredentials(username: string, email: string): Promise<boolean> {
    const user = await getDb().user.findFirst({ where: { username, email }, select: { id: true } })
    return Boolean(user)
}

export async function resetPassword(username: string, email: string, newPassword: string) {
    const { count } = await getDb().user.updateMany({
        where: { username, email },
        data: {
            password: await hashPassword(newPassword),
            sessionVersion: { increment: 1 },
        },
    })

    if (count === 0) throw new HttpError("Usuário não encontrado com essas credenciais", 404)

    return { success: true, message: "Senha alterada com sucesso" }
}