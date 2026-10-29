
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getUserFromSession } from "@/_lib/auth"
import { SESSION_COOKIE } from "@/_lib/session"

export async function GET() {
    const cookieStore = await cookies()
    const user = await getUserFromSession(cookieStore.get(SESSION_COOKIE)?.value)

    if (!user) {
        const response = NextResponse.json({ message: "Não autenticado" }, { status: 401 })
        response.cookies.delete(SESSION_COOKIE)
        return response
    }

    const { password: _, ...publicUser } = user
    return NextResponse.json(publicUser)
}