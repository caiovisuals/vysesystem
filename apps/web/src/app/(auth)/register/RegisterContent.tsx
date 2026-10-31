"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useAuth } from "@/_contexts/AuthContext"
import { PASSWORD_MIN_LENGTH } from "@/_lib/constants"

const inputClassName = "py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-fast cursor-pointer outline-none"

function RegisterForm() {
    const { register } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    const showPasswordIcon = () => {
        if (showPassword) {
            return (
                <>
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                </>
            )
        } else {
            return (
                <>
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                    <path d="m2 2 20 20" />
                </>
            )
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem")
            return
        }

        if (formData.name.trim().length < 3) {
            setError("Nome deve ter pelo menos 3 caracteres")
            return
        }

        if (formData.username.trim().length < 3) {
            setError("Usuário deve ter pelo menos 3 caracteres")
            return
        }

        if (!formData.email.includes("@") || !formData.email.includes(".")) {
            setError("E-mail inválido")
            return
        }

        if (formData.password.length < PASSWORD_MIN_LENGTH) {
            setError(`Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`)
            return
        }

        try {
            setLoading(true)

            await register({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            })

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado ao criar conta")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center justify-center size-full">
                <div className="flex flex-col items-center justify-center gap-6 min-w-[500px]">
                    <h1 className="text-[34px]">Cadastre-se</h1>
                    <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label>Nome</label>
                            <input
                                type="text"
                                placeholder="Digite seu Nome"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value, }))}
                                required
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Nome de Usuário</label>
                            <input
                                type="text"
                                placeholder="Digite um Nome de Usuário"
                                value={formData.username}
                                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value, }))}
                                required
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>E-mail</label>
                            <input
                                type="email"
                                placeholder="Digite seu melhor E-mail"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value, }))}
                                required
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label>Senha</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite uma boa Senha"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value, }))}
                                required
                                className={inputClassName}
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-[12px] top-[56%] flex items-center justify-center bg-transparent outline-none"
                                tabIndex={-1}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width={24}
                                    height={24}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    >
                                    {showPasswordIcon()}
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Confirmar Senha</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirme a sua Senha"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value, }))}
                                required
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
                            {loading ? "Criando Conta" : "Criar Conta"}
                        </button>
                        <div className="flex flex-row">
                            <span>
                                Já passou por aqui? <Link href="/login" className="text-[var(--text-head)]">Entrar com uma Conta</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
		</div>
    )
}

export default function RegisterContent() {
    return (
        <Suspense>
            <RegisterForm />
        </Suspense>
    )
}