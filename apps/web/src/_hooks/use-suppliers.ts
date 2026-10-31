import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ListParams } from "@vysesystem/types"
import toast from "react-hot-toast"
import type { SupplierInput } from "@/_lib/schemas"
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "@vysesystem/api-client"

export const suppliersQueryKey = ["suppliers"] as const

// Uma página da lista; a chave inclui os parâmetros, e invalidar suppliersQueryKey recarrega todas as páginas
export function useSuppliers(params: ListParams = {}, options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: [...suppliersQueryKey, params],
        queryFn: () => getSuppliers(params),
        placeholderData: keepPreviousData,
        ...options,
    })
}

export function useCreateSupplier() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createSupplier,
        onSuccess: () => {
            toast.success("Fornecedor adicionado")
            return queryClient.invalidateQueries({ queryKey: suppliersQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

export function useUpdateSupplier() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<SupplierInput> }) => updateSupplier(id, data),
        onSuccess: () => {
            toast.success("Fornecedor atualizado")
            return queryClient.invalidateQueries({ queryKey: suppliersQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

// Exclui vários registros de uma vez (as linhas selecionadas na tabela)
export function useDeleteSuppliers() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map(deleteSupplier)),
        onSuccess: (_data, ids) => {
            toast.success(ids.length === 1 ? "Fornecedor excluído" : `${ids.length} fornecedores excluídos`)
        },
        onError: (error) => toast.error(error.message),
        // Recarrega mesmo se só parte das exclusões falhar
        onSettled: () => queryClient.invalidateQueries({ queryKey: suppliersQueryKey }),
    })
}