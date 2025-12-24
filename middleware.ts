import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { applySecurityHeaders } from "@/lib/security/headers"

export async function middleware(request: NextRequest) {
    // Finaliza requisição
    const response = NextResponse.next()
    applySecurityHeaders(response)

    return response
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
    ],
}
