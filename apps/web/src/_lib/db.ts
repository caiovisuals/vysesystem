import "server-only"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

// Reaproveita a instância entre recarregamentos do dev server (evita abrir conexões a cada HMR)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Criado sob demanda: o build não precisa de DATABASE_URL, só as rotas que acessam o banco
export function getDb(): PrismaClient {
    if (globalForPrisma.prisma) return globalForPrisma.prisma

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error("DATABASE_URL não definida. Veja a seção Configuração do README.")
    }

    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
    return prisma
}