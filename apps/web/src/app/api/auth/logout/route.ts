import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/_lib/session"

export async function POST() {
    const response = NextResponse.json({ success: true })
    response.cookies.delete(SESSION_COOKIE)

    return response
}