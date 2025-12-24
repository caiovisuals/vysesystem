import { registerUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, username, email, password } = body

        const user = registerUser(name, username, email, password)

        return NextResponse.json(user, { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        )
    }
}
