export type ApiRequestInit = {
    method?: string
    body?: string
    headers?: Record<string, string>
}

export type ApiResponse = {
    ok: boolean
    status: number
    data: unknown
}

// Quem de fato envia a requisição. Cada app escolhe o seu: o web usa fetch na mesma origem e o desktop
// passa pelo processo principal do Electron, que guarda o cookie de sessão fora do alcance da página
export type Transport = (path: string, init: ApiRequestInit) => Promise<ApiResponse>

export const fetchTransport: Transport = async (path, init) => {
    const res = await fetch(path, init)
    const data = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, data }
}

let transport: Transport = fetchTransport

export function setTransport(next: Transport) {
    transport = next
}

// Faz a requisição à API e lança um Error com a mensagem do servidor quando a resposta não é 2xx
export async function request<T>(url: string, init?: ApiRequestInit): Promise<T> {
    const res = await transport(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    })

    if (!res.ok) {
        const message = (res.data as { message?: string } | null)?.message
        throw new Error(message || `Erro ${res.status} ao acessar ${url}`)
    }
    return res.data as T
}