"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { PublicUser } from "@vysesystem/types"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { request } from "@/_lib/services/http"

export type RegisterData = {
    name: string
    username: string
    email: string
    password: string
}

interface AuthContextType {
    user: PublicUser | null
    isLoading: boolean
    // login e register lançam Error com a mensagem do servidor em caso de falha
    login: (username: string, password: string, redirectTo?: string) => Promise<void>
    register: (data: RegisterData, redirectTo?: string) => Promise<void>
    logout: (redirectTo?: string) => Promise<void>
    clearSession: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Aceita só caminhos internos, evitando redirecionar para outro site via ?redirect=
export function safeRedirect(path: string | null | undefined, fallback = "/dashboard") {
    if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback
    return path
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const queryClient = useQueryClient()

    const refreshUser = useCallback(async () => {
        try {
            const res = await fetch("/api/me")
            if (res.ok) {
                setUser(await res.json())
            } else if (res.status === 401) {
                setUser(null)
            }
        } catch (err) {
            // Falha de rede: mantém o estado atual
            console.error("Erro ao validar sessão:", err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Valida a sessão (cookie httpOnly) ao carregar
    useEffect(() => {
        // Remove o cache antigo do usuário, que versões anteriores guardavam no navegador
        localStorage.removeItem("user")
        refreshUser()
    }, [refreshUser])

    const startSession = useCallback((sessionUser: PublicUser, redirectTo: string) => {
        // Dados em cache podem ser de outra conta/empresa
        queryClient.clear()
        setUser(sessionUser)
        router.push(safeRedirect(redirectTo))
    }, [queryClient, router])

    const login = useCallback(async (username: string, password: string, redirectTo = "/dashboard") => {
        const sessionUser = await request<PublicUser>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        })
        startSession(sessionUser, redirectTo)
    }, [startSession])

    const register = useCallback(async (data: RegisterData, redirectTo = "/dashboard") => {
        const sessionUser = await request<PublicUser>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        })
        startSession(sessionUser, redirectTo)
    }, [startSession])

    const clearSession = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
        } catch (err) {
            console.error("Erro ao fazer logout:", err)
        } finally {
            setUser(null)
            localStorage.removeItem("user")
            queryClient.clear()
        }
    }, [queryClient])

    // Navegação completa: zera todo o estado do app e evita que o ProtectedRoute, ao ver o usuário nulo,
    // mande para /login antes de chegar em redirectTo
    const logout = useCallback(async (redirectTo: string = "/") => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
        } catch (err) {
            console.error("Erro ao fazer logout:", err)
        }
        localStorage.removeItem("user")
        window.location.assign(redirectTo)
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, clearSession, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

// Empresa ativa do usuário logado (exibida no cabeçalho da sidebar)
export function useActiveCompany() {
    const { user } = useAuth()
    return user?.companies.find(c => c.id === user.activeCompanyId) ?? null
}