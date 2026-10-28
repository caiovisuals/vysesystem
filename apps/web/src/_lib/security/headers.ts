import { NextResponse } from "next/server"

export function applySecurityHeaders(response: NextResponse): NextResponse {
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
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.vtrackgym.com https://*.supabase.co",
            "media-src 'self' https: blob:",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ].join("; ")
    )

    if (process.env.NODE_ENV === "production") {
        response.headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload"
        )
    }

    return response
}