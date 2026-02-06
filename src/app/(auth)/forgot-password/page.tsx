"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/_contexts/AuthContext"

export default function ForgotPassword() {
    const { login, error: authError, isLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        usernameOrEmail: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
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
                    <h1 className="text-[34px]">Trocar Senha</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label>Nome de Usuário ou Email</label>
                            <input
                                type="text"
                                placeholder="Digite seu Nome de Usuário ou Email"
                                value={formData.usernameOrEmail}
                                onChange={(e) => setFormData((prev) => ({ ...prev, usernameOrEmail: e.target.value, }))}
                                required
                                className="py-2 px-3 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] transition-all duration-150 ease-in-out cursor-pointer outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[18px] py-2 px-3 rounded-[15px] transition-all duration-150 ease-in-out cursor-pointer outline-none"
                        >
                            {loading ? "Enviando Link" : "Enviar Link"}
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