import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { applySecurityHeaders } from "@/_lib/security/headers"
import { isRateLimited, type RateLimitType } from "@/_lib/security/rateLimit"
import { SESSION_COOKIE, verifySessionToken } from "@/_lib/session"

function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) return forwardedFor.split(",")[0].trim()

    return request.headers.get("x-real-ip") ?? "unknown"
}

// Só as rotas de API têm limite de requisições; navegação e prefetch de páginas não contam
function getRateLimitType(pathname: string): RateLimitType | null {
    if (pathname === "/api/auth/logout") return null
    if (pathname.startsWith("/api/auth/")) return "auth"
    if (pathname.startsWith("/api/")) return "api"
    return null
}

function isDashboardRoute(pathname: string): boolean {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
}

function isHttps(request: NextRequest): boolean {
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim()
    return (forwardedProto ?? request.nextUrl.protocol.replace(":", "")) === "https"
}

export async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl
    const https = isHttps(request)

    const rateLimitType = getRateLimitType(pathname)
    if (rateLimitType) {
        let limited = false
        try {
            limited = await isRateLimited(getClientIP(request), rateLimitType)
        } catch (error) {
            // Uma falha no rate limit não derruba o site
            console.error("[RATE_LIMIT]", error)
        }

        if (limited) {
            return applySecurityHeaders(NextResponse.json(
                { message: "Muitas requisições. Tente novamente em alguns minutos." },
                { status: 429 }
            ), https)
        }
    }

    // O painel exige sessão válida (as rotas de API conferem a sessão por conta própria)
    if (isDashboardRoute(pathname)) {
        const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
        if (!session) {
            const loginUrl = new URL("/login", request.url)
            loginUrl.searchParams.set("redirect", pathname + search)
            const response = NextResponse.redirect(loginUrl)
            response.cookies.delete(SESSION_COOKIE)
            return applySecurityHeaders(response, https)
        }
    }

    return applySecurityHeaders(NextResponse.next(), https)
}

export const config = {
    // Runtime Node.js: permite usar o ioredis no rate limit
    runtime: "nodejs",
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
    ],
}