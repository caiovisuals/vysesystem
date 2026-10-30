import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import type { EmployeeInput } from "@/_lib/schemas"
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "@/_lib/services/employees"

export const employeesQueryKey = ["employees"] as const

export function useEmployees() {
    return useQuery({
        queryKey: employeesQueryKey,
        queryFn: getEmployees,
    })
}

export function useCreateEmployee() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            toast.success("Colaborador adicionado")
            return queryClient.invalidateQueries({ queryKey: employeesQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<EmployeeInput> }) => updateEmployee(id, data),
        onSuccess: () => {
            toast.success("Colaborador atualizado")
            return queryClient.invalidateQueries({ queryKey: employeesQueryKey })
        },
        onError: (error) => toast.error(error.message),
    })
}

// Exclui vários registros de uma vez (as linhas selecionadas na tabela)
export function useDeleteEmployees() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map(deleteEmployee)),
        onSuccess: (_data, ids) => {
            toast.success(ids.length === 1 ? "Colaborador excluído" : `${ids.length} colaboradores excluídos`)
        },
        onError: (error) => toast.error(error.message),
        // Recarrega mesmo se só parte das exclusões falhar; as vendas ligadas ao registro perdem o vínculo
        onSettled: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: employeesQueryKey }),
            queryClient.invalidateQueries({ queryKey: ["sales"] }),
        ]),
    })
}