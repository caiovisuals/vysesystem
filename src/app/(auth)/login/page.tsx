"use client"

import Link from "next/link"
import { useState } from "react"

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    const showPasswordIcon = () => {
        if (showPassword) {
            return (
                <>
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                </>
            )
        } else {
            return (
                <>
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                    <path d="m2 2 20 20"/>
                </>
            )
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                return
            }
        } catch {
            setError("Erro ao fazer login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full h-screen">
            <header className="p-8 flex flex-row items-center justify-between">
                <Link href="/">
                    <img src="/logo.png" alt="logo" className="h-[25px]"/>
                </Link>
                <div className="flex flex-row gap-4">
                    <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Documentação</Link>
                    <Link href="/why" className="text-center py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Por que usar?</Link>
                    <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                </div>
            </header>
            <div className="flex items-center justify-center size-full">
                <div className="flex flex-col items-center justify-center gap-6 min-w-[500px]">
                    <h1 className="text-[34px]">Logar</h1>
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label>Nome de Usuário</label>
                            <input
                                type="text"
                                placeholder="Digite seu Nome de Usuário"
                                value={formData.username}
                                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value, }))}
                                required
                                className="py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-all duration-150 ease-in-out cursor-pointer outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label>Senha</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua Senha"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value, }))}
                                required
                                className="py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-all duration-150 ease-in-out cursor-pointer outline-none"
                            />
                            <button
                                type="button"
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[18px] py-2 px-3 rounded-[15px] transition-all duration-150 ease-in-out cursor-pointer outline-none"
                        >
                            Entrar
                        </button>
                        <div className="flex flex-row">
                            <span>
                                Ainda não tem conta? <Link href="/register" className="text-[var(--text-head)]">Criar conta</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
		</div>
    )
}