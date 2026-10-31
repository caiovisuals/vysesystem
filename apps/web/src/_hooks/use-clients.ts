import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import type { ClientInput } from "@/_lib/schemas"
import { createClient, deleteClient, getClients, updateClient, type ClientListParams } from "@vysesystem/api-client"

export const clientsQueryKey = ["clients"] as const

// Uma página da lista; a chave inclui os parâmetros, e invalidar clientsQueryKey recarrega todas as páginas
export function useClients(params: ClientListParams = {}, options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: [...clientsQueryKey, params],
        queryFn: () => getClients(params),
        placeholderData: keepPreviousData,
        ...options,
    })
}

export function useCreateClient() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            toast.success("Cliente adicionado")
            return queryClient.invalidateQueries({ queryKey: clientsQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

export function useUpdateClient() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<ClientInput> }) => updateClient(id, data),
        onSuccess: () => {
            toast.success("Cliente atualizado")
            return queryClient.invalidateQueries({ queryKey: clientsQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

export function useDeleteClients() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map(deleteClient)),
        onSuccess: (_data, ids) => {
            toast.success(ids.length === 1 ? "Cliente excluído" : `${ids.length} clientes excluídos`)
        },
        onError: (error) => toast.error(error.message),
        // Recarrega mesmo se só parte das exclusões falhar
        onSettled: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
            queryClient.invalidateQueries({ queryKey: ["sales"] }),
        ]),
    })
}