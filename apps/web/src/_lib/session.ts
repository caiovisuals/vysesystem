export const SESSION_COOKIE = "auth-token"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias, em segundos

export const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
}

export type SessionPayload = {
    sub: string // id do usuário
    ver: number // sessionVersion do usuário quando o token foi emitido
    exp: number // expiração em ms desde epoch
}

const DEV_SECRET = "vysesystem-dev-secret-nao-use-em-producao"
const encoder = new TextEncoder()
const decoder = new TextDecoder()

let cachedKey: Promise<CryptoKey> | null = null

function getSecret(): string {
    const secret = process.env.AUTH_SECRET
    if (secret && secret.length >= 32) return secret

    if (process.env.NODE_ENV === "production") {
        throw new Error("AUTH_SECRET ausente ou curta demais (mínimo de 32 caracteres). Gere com: openssl rand -hex 32")
    }
    return DEV_SECRET
}

function getKey(): Promise<CryptoKey> {
    cachedKey ??= crypto.subtle.importKey(
        "raw",
        encoder.encode(getSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
    )
    return cachedKey
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = ""
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
    const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
}

export async function createSessionToken(userId: string, sessionVersion = 0): Promise<string> {
    const payload: SessionPayload = {
        sub: userId,
        ver: sessionVersion,
        exp: Date.now() + SESSION_MAX_AGE * 1000,
    }
    const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)))
    const signature = await crypto.subtle.sign("HMAC", await getKey(), encoder.encode(encodedPayload))
    return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`
}

// Retorna o payload se a assinatura for válida e o token não tiver expirado; senão, null
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
    if (!token) return null

    const [encodedPayload, signature, extra] = token.split(".")
    if (!encodedPayload || !signature || extra !== undefined) return null

    try {
        // crypto.subtle.verify compara em tempo constante
        const valid = await crypto.subtle.verify(
            "HMAC",
            await getKey(),
            fromBase64Url(signature),
            encoder.encode(encodedPayload),
        )
        if (!valid) return null

        const payload = JSON.parse(decoder.decode(fromBase64Url(encodedPayload))) as SessionPayload
        if (typeof payload.sub !== "string" || typeof payload.ver !== "number" || typeof payload.exp !== "number") {
            return null
        }
        return payload.exp > Date.now() ? payload : null
    } catch {
        // base64 ou JSON malformado
        return null
    }
}