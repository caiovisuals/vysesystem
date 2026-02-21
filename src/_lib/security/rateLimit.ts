import Redis from "ioredis"

const IS_PROD = process.env.NODE_ENV === "production"

type RateLimitType = "auth" | "api" | "general"

interface SuspiciousIPData {
    blockedUntil: number
    violations: number
    lastViolation: number
}

let redis: Redis | null = null

// Store para tracking de IPs suspeitos (proteção adicional)
const suspiciousIPs = new Map<string, SuspiciousIPData>()

const CONFIG = {
    RATE_LIMIT_WINDOW: 15 * 60, // 15 minutos em segundos
    MAX_REQUESTS: {
        auth: 5,
        api: 100,
        general: 200,
    },
    MAX_VIOLATIONS: 3, // Máximo de violações antes de bloqueio prolongado
    VIOLATION_RESET_TIME: 24 * 60 * 60 * 1000,
}

function isIPBlocked(ip: string): boolean {
    const suspicious = suspiciousIPs.get(ip)
    if (!suspicious) return false
    
    if (Date.now() < suspicious.blockedUntil) {
        return true
    }
    
    // Limpar bloqueio expirado
    suspiciousIPs.delete(ip)
    return false
}

export async function isRateLimited(
    ip: string,
    type: RateLimitType,
    fingerprint?: string
) {
    if (IS_PROD && !redis) {
        throw new Error(
            "Redis é obrigatório em produção para rate limiting"
        )
    }

    // Verificar se IP está bloqueado
    if (isIPBlocked(ip)) {
        return true
    }

    const key = fingerprint
        ? `rate_limit:${type}:${ip}:${fingerprint}`
        : `rate_limit:${type}:${ip}`
    const max = CONFIG.MAX_REQUESTS[type] || CONFIG.MAX_REQUESTS.general

    try {
        if (redis && redis.status === 'ready') {
            const current = await redis.incr(key)
            if (current === 1) {
                await redis.expire(key, CONFIG.RATE_LIMIT_WINDOW)
            }

            const limited = current > max
            
            return limited
        }
    } catch (error) {
        console.error('[RATE_LIMIT] Erro ao acessar Redis, usando fallback:', error)

        if (IS_PROD) {
            return true
        }
    }
}