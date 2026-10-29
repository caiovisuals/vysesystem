import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { applySecurityHeaders } from "@/_lib/security/headers"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { SESSION_COOKIE, verifySessionToken } from "@/_lib/session"

function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim()
    }

    if (realIp) {
        return realIp
    }

    return "unknown"
}

// Páginas do painel e rotas de API (exceto as de autenticação) exigem sessão válida
function isProtectedRoute(pathname: string): boolean {
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return true
    if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) return true
    return false
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const ip = getClientIP(request)

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/forgot-password',
        '/account-deleted',
        '/documentation',
        '/why',
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/forgot-password',
    ]

    // Verifica se é uma rota pública
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

    // Arquivos estáticos também são públicos
    const isStaticFile = pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)$/)

    // RATE LIMIT (ANTES DE TUDO)
    let rateLimitType: "auth" | "api" | "general" = "general"

    if (pathname.startsWith("/api/auth")) {
        rateLimitType = "auth"
    } else if (pathname.startsWith("/api")) {
        rateLimitType = "api"
    }

    let limited = false
    try {
        limited = Boolean(await isRateLimited(ip, rateLimitType))
    } catch (error) {
        // Sem Redis em produção o rate limit lança erro; não derruba o site por isso
        console.error("[RATE_LIMIT]", error)
    }

    if (limited) {
        const response = new NextResponse(
            JSON.stringify({ error: "Too many requests" }),
            { status: 429 }
        )

        applySecurityHeaders(response)
        return response
    }

    // Se for rota pública ou arquivo estático, permite acesso
    if (isPublicRoute || isStaticFile) {
        const response = NextResponse.next()
        applySecurityHeaders(response)
        return response
    }

    // Verifica autenticação para rotas protegidas
    const authToken = request.cookies.get('auth-token')

    // Se não tiver token e estiver tentando acessar rota protegida
    if (!authToken && pathname.startsWith('/dashboard')) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Permite acesso se tiver token
    const response = NextResponse.next()
    applySecurityHeaders(response)
    return response
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
    ],
}