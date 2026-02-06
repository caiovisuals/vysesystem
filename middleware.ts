import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { applySecurityHeaders } from "@/_lib/security/headers"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/forgot-password',
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