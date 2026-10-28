"use client"

import { useEffect } from "react"
import Link from "next/link"

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center gap-6 w-screen h-screen px-4 text-center">
            <title>Erro - VyseSystem</title>
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-[50px] font-[700] leading-12">Erro</h2>
                <span className="text-[22px]">Algo deu errado ao carregar esta página</span>
                {error.digest && (
                    <span className="text-[14px] text-[var(--sub-text)]">Código: {error.digest}</span>
                )}
            </div>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="px-5 py-2 rounded-lg bg-[var(--text-head)] text-[var(--background)] font-[600] cursor-pointer hover:opacity-90 transition-opacity"
                >
                    Tentar novamente
                </button>
                <Link
                    href="/"
                    className="px-5 py-2 rounded-lg bg-[var(--second-background)] border border-[var(--middleground)] hover:bg-[var(--foreground)] transition-colors"
                >
                    Voltar ao início
                </Link>
            </div>
        </div>
    )
}