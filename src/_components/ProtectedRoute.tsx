"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/_contexts/AuthContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--foreground)] border-t-[var(--text)] rounded-full animate-spin"/>
                    <span className="text-[var(--sub-text)]">Carregando...</span>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}