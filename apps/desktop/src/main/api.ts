import { app } from "electron"
import type { ApiRequestInit, ApiResponse } from "@vysesystem/api-client"
import { SESSION_COOKIE, applySetCookies, getSessionToken } from "./session"

// URL do app web cuja API o desktop consome; VYSE_API_URL permite trocar sem gerar outro build
export const API_URL = new URL(process.env.VYSE_API_URL || import.meta.env.MAIN_VITE_API_URL || "http://localhost:3000")

const ALLOWED_METHODS = new Set(["GET", "POST", "PATCH", "PUT", "DELETE"])
const API_PATH = /^\/api\/[\w\-/]*(\?[\w\-=&%.]*)?$/
const MAX_BODY_LENGTH = 1024 * 1024
const TIMEOUT_MS = 15_000

// O renderer só escolhe caminho, método e corpo; host, cookie e cabeçalhos são decididos aqui
function validate(path: unknown, init: unknown): { path: string, method: string, body?: string } {
    if (typeof path !== "string" || !API_PATH.test(path)) throw new Error("Caminho de API inválido")

    const { method = "GET", body } = (init ?? {}) as ApiRequestInit
    if (typeof method !== "string" || !ALLOWED_METHODS.has(method.toUpperCase())) throw new Error("Método inválido")
    if (body !== undefined && (typeof body !== "string" || body.length > MAX_BODY_LENGTH)) throw new Error("Corpo inválido")

    return { path, method: method.toUpperCase(), body }
}

export async function apiRequest(rawPath: unknown, rawInit: unknown): Promise<ApiResponse> {
    let request
    try {
        request = validate(rawPath, rawInit)
    } catch (error) {
        return { ok: false, status: 400, data: { message: (error as Error).message } }
    }

    const token = getSessionToken()
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": `VyseSystem-Desktop/${app.getVersion()}`,
    }
    if (token) headers.Cookie = `${SESSION_COOKIE}=${token}`

    try {
        const res = await fetch(new URL(request.path, API_URL), {
            method: request.method,
            body: request.body,
            headers,
            redirect: "error",
            signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        applySetCookies(res.headers.getSetCookie())

        const data = await res.json().catch(() => null)
        return { ok: res.ok, status: res.status, data }
    } catch (error) {
        console.error("[API]", error)
        return { ok: false, status: 0, data: { message: `Não foi possível conectar ao servidor (${API_URL.origin})` } }
    }
}