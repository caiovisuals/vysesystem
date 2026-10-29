import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useAuth } from "@/_contexts/AuthContext"
import { updateActiveCompany } from "@/_lib/services/company"

export function useUpdateActiveCompany() {
    const { refreshUser } = useAuth()

    return useMutation({
        mutationFn: updateActiveCompany,
        onSuccess: () => {
            toast.success("Empresa atualizada")
            // A empresa ativa vem de /api/me (AuthContext): recarrega para o cabeçalho e o modal refletirem a mudança
            return refreshUser()
        },
        onError: (error) => toast.error(error.message),
    })
}