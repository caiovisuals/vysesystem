"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { User } from "@vysesystem/types"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    login: (username: string, password: string) => Promise<void>
    logout: (redirectTo?: string) => Promise<void>
    clearSession: () => Promise<void>
    isLoading: boolean
    error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Verificar se há usuário logado ao carregar
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (err) {
                console.error("Erro ao carregar usuário:", err)
                localStorage.removeItem("user")
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (username: string, password: string) => {
        setError(null)
        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Erro ao fazer login")
                setIsLoading(false)
                return
            }

            // Salvar usuário no estado e localStorage
            setUser(data)
            localStorage.setItem("user", JSON.stringify(data))
            
            // Redirecionar para dashboard
            router.push("/dashboard")
        } catch (err) {
            setError("Erro ao fazer login")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const clearSession = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            })
        } catch (err) {
            console.error("Erro ao fazer logout:", err)
        } finally {
            // Limpar estado local
            setUser(null)
            localStorage.removeItem("user")
        }
    }, [])

    const logout = async (redirectTo: string = "/") => {
        await clearSession()
        router.push(redirectTo)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, clearSession, isLoading, error }}>
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