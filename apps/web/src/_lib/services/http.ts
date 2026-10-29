// Faz a requisição à API e lança um Error com a mensagem do servidor quando a resposta não é 2xx
export async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
        throw new Error(data?.message || `Erro ${res.status} ao acessar ${url}`)
    }
    return data as T
}