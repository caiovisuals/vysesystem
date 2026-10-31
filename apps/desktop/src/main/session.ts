import { app, safeStorage } from "electron"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

// Mesmo nome do cookie definido pelo web em apps/web/src/_lib/session.ts
export const SESSION_COOKIE = "auth-token"

// O token de sessão fica só no processo principal (como um cookie httpOnly: a página nunca o vê).
// Entre aberturas do app, é guardado criptografado pelo sistema (Keychain, DPAPI ou libsecret).
const sessionFile = () => join(app.getPath("userData"), "session.bin")

let token: string | null = null

export function loadSession() {
    if (!safeStorage.isEncryptionAvailable() || !existsSync(sessionFile())) return
    try {
        token = safeStorage.decryptString(readFileSync(sessionFile()))
    } catch {
        // Arquivo corrompido ou de outra máquina: começa deslogado
        clearSession()
    }
}

export function getSessionToken() {
    return token
}

export function setSessionToken(value: string) {
    token = value
    // Sem criptografia disponível, a sessão vale só enquanto o app estiver aberto
    if (safeStorage.isEncryptionAvailable()) {
        writeFileSync(sessionFile(), safeStorage.encryptString(value))
    }
}

export function clearSession() {
    token = null
    rmSync(sessionFile(), { force: true })
}

// Aplica os Set-Cookie da resposta: grava o token novo ou apaga quando o servidor expira o cookie
export function applySetCookies(setCookies: string[]) {
    for (const header of setCookies) {
        const [pair, ...attributes] = header.split(";")
        const separator = pair.indexOf("=")
        if (pair.slice(0, separator).trim() !== SESSION_COOKIE) continue

        const value = pair.slice(separator + 1).trim()
        const expired = attributes.some(attribute => {
            const [key, raw = ""] = attribute.split("=")
            const name = key.trim().toLowerCase()
            if (name === "max-age") return Number(raw) <= 0
            if (name === "expires") return new Date(raw).getTime() <= Date.now()
            return false
        })

        if (!value || expired) clearSession()
        else setSessionToken(value)
    }
}