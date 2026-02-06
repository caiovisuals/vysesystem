import { ForgotPasswordUser } from "@/_lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, email } = body

        const user = ForgotPasswordUser(username, email)

        return NextResponse.json(user)
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 401 }
        )
    }
}
