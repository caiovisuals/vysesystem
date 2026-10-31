import { PublicUser } from "@vysesystem/types"
import { request } from "./http"

export function login(username: string, password: string) {
    return request<PublicUser>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    })
}

export function logout() {
    return request<{ success: boolean }>("/api/auth/logout", { method: "POST" })
}

export function getMe() {
    return request<PublicUser>("/api/me")
}