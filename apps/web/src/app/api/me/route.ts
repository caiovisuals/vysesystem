
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getUserById } from "@/_lib/auth"

export async function GET() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value
    const user = userId ? getUserById(userId) : null

    if (!user) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 })
    }

    return NextResponse.json
}