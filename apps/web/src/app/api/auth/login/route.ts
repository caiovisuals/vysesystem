import { NextResponse } from "next/server"
import { loginUser } from "@/_lib/auth"
import { handleError, parseBody } from "@/_lib/api"
import { loginSchema } from "@/_lib/schemas"
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/_lib/session"

export async function POST(req: Request) {
    try {
        const { username, password } = await parseBody(req, loginSchema)
        const user = await loginUser(username, password)

        const response = NextResponse.json(user)

        // Cookie httpOnly: o token não fica acessível ao JavaScript da página
        response.cookies.set(
            SESSION_COOKIE,
            await createSessionToken(user.id, user.sessionVersion ?? 0),
            sessionCookieOptions
        )

        return response
    } catch (error) {
        return handleError(error)
    }
}