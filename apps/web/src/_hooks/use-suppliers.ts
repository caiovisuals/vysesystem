import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import type { SupplierInput } from "@/_lib/schemas"
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "@/_lib/services/suppliers"

export const suppliersQueryKey = ["suppliers"] as const

export function useSuppliers() {
    return useQuery({
        queryKey: suppliersQueryKey,
        queryFn: getSuppliers,
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