import { NextResponse } from "next/server"

const IS_PROD = process.env.NODE_ENV === "production"

// "https" só quando a requisição chegou por HTTPS (direto ou via proxy). Em http (ex.: `npm run start`
// local) HSTS e upgrade-insecure-requests fariam o navegador trocar tudo para https e quebrar o site.
export function applySecurityHeaders(response: NextResponse, https = false): NextResponse {
    const enforceHttps = IS_PROD && https

    // Proteções básicas
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-DNS-Prefetch-Control", "off")
    response.headers.set("X-Permitted-Cross-Domain-Policies", "none")

    // Isolamento de contexto
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
    response.headers.set("Cross-Origin-Resource-Policy", "same-origin")

    response.headers.set(
        "Permissions-Policy",
        "geolocation=(), microphone=(), camera=(), payment=()"
    )
    response.headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            `script-src 'self' 'unsafe-inline'${IS_PROD ? "" : " 'unsafe-eval'"}`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "media-src 'self' https: blob:",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            ...(enforceHttps ? ["upgrade-insecure-requests"] : []),
        ].join("; ")
    )

    if (enforceHttps) {
        response.headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload"
        )
    }

    return response
}