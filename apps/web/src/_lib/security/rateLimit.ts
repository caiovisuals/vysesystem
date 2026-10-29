import Redis from "ioredis"

export type RateLimitType = "auth" | "api"

const CONFIG = {
    WINDOW_SECONDS: 15 * 60, // 15 minutos
    MAX_REQUESTS: {
        auth: 10,
        api: 300,
    } satisfies Record<RateLimitType, number>,
}

// Com REDIS_URL o contador é compartilhado entre instâncias; sem ele, fica na memória do processo
let redis: Redis | null = null
if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, enableOfflineQueue: false })
    redis.on("error", (error) => console.error("[RATE_LIMIT] Redis:", error.message))
}

type MemoryEntry = { count: number, resetAt: number }
const memoryStore = new Map<string, MemoryEntry>()
const MAX_MEMORY_KEYS = 10_000

function incrementInMemory(key: string): number {
    const now = Date.now()
    const entry = memoryStore.get(key)

    if (!entry || entry.resetAt <= now) {
        // Evita crescimento sem limite: descarta as janelas já expiradas quando o mapa enche
        if (memoryStore.size >= MAX_MEMORY_KEYS) {
            for (const [storedKey, stored] of memoryStore) {
                if (stored.resetAt <= now) memoryStore.delete(storedKey)
            }
        }
        memoryStore.set(key, { count: 1, resetAt: now + CONFIG.WINDOW_SECONDS * 1000 })
        return 1
    }

    entry.count += 1
    return entry.count
}

async function incrementInRedis(client: Redis, key: string): Promise<number> {
    const count = await client.incr(key)
    if (count === 1) await client.expire(key, CONFIG.WINDOW_SECONDS)
    return count
}

// Janela fixa por IP e tipo de rota; retorna true quando o limite foi excedido
export async function isRateLimited(ip: string, type: RateLimitType): Promise<boolean> {
    const key = `rate_limit:${type}:${ip}`
    const max = CONFIG.MAX_REQUESTS[type]

    let count: number
    if (redis?.status === "ready") {
        try {
            count = await incrementInRedis(redis, key)
        } catch (error) {
            console.error("[RATE_LIMIT] Falha no Redis, usando memória:", error)
            count = incrementInMemory(key)
        }
    } else {
        count = incrementInMemory(key)
    }

    return count > max
}