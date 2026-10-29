import { NextResponse } from "next/server"
import { registerUser } from "@/_lib/auth"
import { handleError, parseBody } from "@/_lib/api"
import { registerSchema } from "@/_lib/schemas"
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/_lib/session"

export async function POST(req: Request) {
    try {
        const data = await parseBody(req, registerSchema)
        const user = await registerUser(data)

        const response = NextResponse.json(
            { ...user, message: "Conta criada com sucesso!" },
            { status: 201 }
        )

        // Já entra logado após o cadastro
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