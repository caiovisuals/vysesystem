"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { request } from "@/_lib/services/http"

const inputClassName = "py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-fast cursor-pointer outline-none disabled:opacity-60"

function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [sentMessage, setSentMessage] = useState("")

    const [formData, setFormData] = useState({
        username: "",
        email: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            setLoading(true)
            const { message } = await request<{ message: string }>("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email
                }),
            })

            setSentMessage(message)
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
                    {sentMessage ? (
                        <div className="w-full flex flex-col gap-4">
                            <span role="status">{sentMessage}</span>
                            <span>O link vale por 30 minutos. Não recebeu? Confira o spam ou peça outro.</span>
                            <div className="flex flex-row gap-4">
                                <Link href="/login" className="text-[var(--text-head)]">Voltar ao Login</Link>
                                <button
                                    type="button"
                                    onClick={() => setSentMessage("")}
                                    className="text-[var(--text-head)] cursor-pointer"
                                >
                                    Enviar outro link
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label>Nome de Usuário</label>
                                <input
                                    type="text"
                                    placeholder="Digite seu Nome de Usuário"
                                    value={formData.username}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                                    required
                                    autoComplete="username"
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
                                    required
                                    autoComplete="email"
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
                                {loading ? "Enviando" : "Enviar Link"}
                            </button>
                            <div className="flex flex-row">
                                <span>
                                    Lembrou sua senha? <Link href="/login" className="text-[var(--text-head)]">Fazer Login</Link>
                                </span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
		</div>
    )
}

export default function ForgotPasswordContent() {
    return (
        <Suspense>
            <ForgotPasswordForm />
        </Suspense>
    )
}