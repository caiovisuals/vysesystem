"use client"

import { useEffect } from "react"
import { useAuth } from "@/_contexts/AuthContext"

// Garante que nenhum resquício da sessão fique no navegador após sair da plataforma
export default function ClearSession() {
    const { clearSession } = useAuth()

    useEffect(() => {
        clearSession()
    }, [clearSession])

    return null
}