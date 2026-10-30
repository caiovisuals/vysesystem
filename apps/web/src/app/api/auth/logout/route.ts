import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { revokeSessions } from "@/_lib/auth"
import { SESSION_COOKIE } from "@/_lib/session"

export async function POST() {
    const cookieStore = await cookies()
    try {
        await revokeSessions(cookieStore.get(SESSION_COOKIE)?.value)
    } catch (error) {
        // Mesmo se o banco falhar, o cookie é apagado e o usuário sai
        console.error("[LOGOUT]", error)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete(SESSION_COOKIE)

    return response
}