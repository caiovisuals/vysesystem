import { Client, ListParams, Paginated } from "@vysesystem/types"
import type { ClientInput } from "@vysesystem/schemas"
import { request } from "./http"
import { toQuery } from "./query"

export type ClientListParams = ListParams & { tag?: string }

export function getClients(params: ClientListParams = {}) {
    return request<Paginated<Client>>(`/api/clients${toQuery(params)}`)
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