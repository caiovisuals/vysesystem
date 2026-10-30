import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import type { ProductInput } from "@/_lib/schemas"
import { createProduct, deleteProduct, getProducts, updateProduct } from "@/_lib/services/products"

export const productsQueryKey = ["products"] as const

export function useProducts() {
    return useQuery({
        queryKey: productsQueryKey,
        queryFn: getProducts,
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            toast.success("Produto adicionado")
            return queryClient.invalidateQueries({ queryKey: productsQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<ProductInput> }) => updateProduct(id, data),
        onSuccess: () => {
            toast.success("Produto atualizado")
            return queryClient.invalidateQueries({ queryKey: productsQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

// Exclui vários registros de uma vez (as linhas selecionadas na tabela)
export function useDeleteProducts() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map(deleteProduct)),
        onSuccess: (_data, ids) => {
            toast.success(ids.length === 1 ? "Produto excluído" : `${ids.length} produtos excluídos`)
        },
        onError: (error) => toast.error(error.message),
        // Recarrega mesmo se só parte das exclusões falhar; as vendas ligadas ao registro perdem o vínculo
        onSettled: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: productsQueryKey }),
            queryClient.invalidateQueries({ queryKey: ["sales"] }),
        ]),
    })
}