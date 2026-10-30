import { Client } from "@vysesystem/types"
import type { ClientInput } from "@/_lib/schemas"
import { request } from "./http"

export function getClients() {
    return request<Client[]>("/api/clients")
}

export function createClient(client: ClientInput) {
    return request<Client>("/api/clients", {
        method: "POST",
        body: JSON.stringify(client),
    })
}

export function updateClient(id: string, data: Partial<ClientInput>) {
    return request<Client>(`/api/clients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}

export function deleteClient(id: string) {
    return request<null>(`/api/clients/${id}`, { method: "DELETE" })
}