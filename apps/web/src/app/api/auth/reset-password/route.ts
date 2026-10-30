import { NextResponse } from "next/server"
import { resetPasswordWithToken } from "@/_lib/auth"
import { handleError, parseBody } from "@/_lib/api"
import { resetPasswordSchema } from "@/_lib/schemas"

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await parseBody(req, resetPasswordSchema)
        return NextResponse.json(await resetPasswordWithToken(token, newPassword))
    } catch (error) {
        return handleError(error)
    }
}