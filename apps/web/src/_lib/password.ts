import { randomBytes, scrypt, timingSafeEqual, createHash, type ScryptOptions } from "node:crypto"

const KEY_LENGTH = 64
const SALT_BYTES = 16
const PARAMS = { N: 16384, r: 8, p: 1 }

function deriveKey(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (error, key) => {
            if (error) reject(error)
            else resolve(key)
        })
    })
}

// Formato: scrypt$N$r$p$salt$hash (salt e hash em base64)
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_BYTES)
    const key = await deriveKey(password, salt, PARAMS)
    return ["scrypt", PARAMS.N, PARAMS.r, PARAMS.p, salt.toString("base64"), key.toString("base64")].join("$")
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const parts = stored.split("$")

    if (parts.length === 6 && parts[0] === "scrypt") {
        const [, N, r, p, salt, hash] = parts
        const expected = Buffer.from(hash, "base64")
        const key = await deriveKey(password, Buffer.from(salt, "base64"), {
            N: Number(N),
            r: Number(r),
            p: Number(p),
        })
        return key.length === expected.length && timingSafeEqual(key, expected)
    }

    // Formato antigo: SHA-256 em hex, sem salt
    if (/^[0-9a-f]{64}$/i.test(stored)) {
        const legacy = createHash("sha256").update(password).digest()
        return timingSafeEqual(legacy, Buffer.from(stored, "hex"))
    }

    return false
}

// Indica se o hash deve ser regerado (formato antigo ou parâmetros desatualizados)
export function needsRehash(stored: string): boolean {
    const [algorithm, N, r, p] = stored.split("$")
    return algorithm !== "scrypt" || Number(N) !== PARAMS.N || Number(r) !== PARAMS.r || Number(p) !== PARAMS.p
}