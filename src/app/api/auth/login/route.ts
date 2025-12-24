import { loginUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, password } = body

        const user = loginUser(username, password)

        return NextResponse.json(user)
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 401 }
        )
    }
}
