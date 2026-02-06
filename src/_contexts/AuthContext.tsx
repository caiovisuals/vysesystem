"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/_types/user"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
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
            setUser(JSON.parse(storedUser))
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

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
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