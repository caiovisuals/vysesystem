"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { request } from "@/_lib/services/http"

const inputClassName = "py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-fast cursor-pointer outline-none disabled:opacity-60"

function ForgotPasswordForm() {
    const router = useRouter()
    // "verify": confere usuário + e-mail; "reset": define a nova senha
    const [step, setStep] = useState<"verify" | "reset">("verify")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (step === "reset") {
            if (formData.newPassword.length < 6) {
                setError("Nova senha deve ter pelo menos 6 caracteres")
                return
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError("As senhas não coincidem")
                return
            }
        }

        try {
            setLoading(true)
            await request("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({
                    step,
                    username: formData.username,
                    email: formData.email,
                    ...(step === "reset" ? { newPassword: formData.newPassword } : {}),
                }),
            })

            if (step === "verify") {
                setStep("reset")
            } else {
                toast.success("Senha alterada! Entre com a nova senha.")
                router.push("/login")
            }
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
                    <h1 className="text-[34px]">Trocar Senha</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label>Nome de Usuário</label>
                            <input
                                type="text"
                                placeholder="Digite seu Nome de Usuário"
                                value={formData.username}
                                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                                disabled={step === "reset"}
                                required
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>E-mail</label>
                            <input
                                type="email"
                                placeholder="Digite o E-mail da sua conta"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                disabled={step === "reset"}
                                required
                                className={inputClassName}
                            />
                        </div>
                        {step === "reset" && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label>Nova Senha</label>
                                    <input
                                        type="password"
                                        placeholder="Digite a nova Senha"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                                        required
                                        autoFocus
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
                                        className={inputClassName}
                                    />
                                </div>
                            </>
                        )}
                        {error && (
                            <span role="alert" className="text-red-500">{error}</span>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[18px] py-2 px-3 rounded-[15px] transition-fast cursor-pointer outline-none"
                        >
                            {step === "verify"
                                ? (loading ? "Verificando" : "Continuar")
                                : (loading ? "Salvando" : "Salvar Nova Senha")}
                        </button>
                        <div className="flex flex-row">
                            <span>
                                Lembrou sua senha? <Link href="/login" className="text-[var(--text-head)]">Fazer Login</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
		</div>
    )
}

export default function ForgotPassword() {
    return (
        <Suspense>
            <ForgotPasswordForm />
        </Suspense>
    )
}