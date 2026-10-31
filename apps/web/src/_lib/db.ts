import "server-only"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

// Uma única instância (e um único pool de conexões) por processo. Em desenvolvimento ela fica no globalThis
// para sobreviver aos recarregamentos do HMR, que reavaliam este módulo
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Criado sob demanda: o build não precisa de DATABASE_URL, só as rotas que acessam o banco
export function getDb(): PrismaClient {
    if (globalForPrisma.prisma) return globalForPrisma.prisma

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error("DATABASE_URL não definida. Veja a seção Configuração do README.")
    }

    // Guardada também em produção: sem isso cada chamada abriria um pool novo e esgotaria as conexões do Postgres
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
    return globalForPrisma.prisma
}