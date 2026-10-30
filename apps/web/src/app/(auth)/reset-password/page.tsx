"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { PASSWORD_MIN_LENGTH } from "@/_lib/constants"
import { request } from "@/_lib/services/http"

const inputClassName = "py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-fast cursor-pointer outline-none disabled:opacity-60"

function ResetPasswordForm() {
    const router = useRouter()
    // Token de uso único que chega pelo link do e-mail
    const token = useSearchParams().get("token") ?? ""
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.newPassword.length < PASSWORD_MIN_LENGTH) {
            setError(`Nova senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`)
            return
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError("As senhas não coincidem")
            return
        }

        try {
            setLoading(true)
            await request("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, newPassword: formData.newPassword }),
            })
            toast.success("Senha alterada! Entre com a nova senha.")
            router.push("/login")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao processar solicitação")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center justify-center size-full">
                <div className="flex flex-col items-center justify-center gap-6 min-w-[500px]">
                    <h1 className="text-[34px]">Nova Senha</h1>
                    {!token ? (
                        <div className="w-full flex flex-col gap-4">
                            <span role="alert" className="text-red-500">Link de recuperação inválido.</span>
                            <Link href="/forgot-password" className="text-[var(--text-head)]">Solicitar um novo link</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label>Nova Senha</label>
                                <input
                                    type="password"
                                    placeholder="Digite a nova Senha"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                                    required
                                    autoFocus
                                    autoComplete="new-password"
                                    className={inputClassName}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    placeholder="Confirme a nova Senha"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                    autoComplete="new-password"
                                    className={inputClassName}
                                />
                            </div>
                            {error && (
                                <span role="alert" className="text-red-500">{error}</span>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[18px] py-2 px-3 rounded-[15px] transition-fast cursor-pointer outline-none"
                            >
                                {loading ? "Salvando" : "Salvar Nova Senha"}
                            </button>
                            <div className="flex flex-row">
                                <span>
                                    Link expirado? <Link href="/forgot-password" className="text-[var(--text-head)]">Solicitar outro</Link>
                                </span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
		</div>
    )
}

export default function ResetPassword() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    )
}