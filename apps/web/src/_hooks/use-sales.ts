import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SaleStatus } from "@vysesystem/types"
import toast from "react-hot-toast"
import { createSale, getSale, getSales, updateSaleStatus } from "@vysesystem/api-client"

export const salesQueryKey = ["sales"] as const

export function useSales() {
    return useQuery({
        queryKey: salesQueryKey,
        queryFn: getSales,
    })
}

export function useSale(id: string | undefined) {
    return useQuery({
        queryKey: [...salesQueryKey, id],
        queryFn: () => getSale(id!),
        enabled: Boolean(id),
    })
}

// Vendas mexem no estoque, então os produtos também são recarregados
function useInvalidateSales() {
    const queryClient = useQueryClient()
    return () => Promise.all([
        queryClient.invalidateQueries({ queryKey: salesQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
    ])
}

export function useCreateSale() {
    const invalidate = useInvalidateSales()

    return useMutation({
        mutationFn: createSale,
        onSuccess: () => invalidate(),
        onError: (error) => toast.error(error.message),
    })
}

export function useUpdateSaleStatus() {
    const invalidate = useInvalidateSales()

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: SaleStatus }) => updateSaleStatus(id, status),
        onSuccess: () => invalidate(),
        onError: (error) => toast.error(error.message),
    })
}