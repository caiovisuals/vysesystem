"use client"

import Link from "next/link"

export default function Header() {
    return (
        <header className="p-8 flex flex-row items-center justify-between">
            <Link href="/">
                <img src="/logo.png" alt="logo" className="h-[25px]"/>
            </Link>
            <div className="flex flex-row gap-4">
                <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                <div className="h-auto w-0.5 bg-[var(--middleground)]"/>
                <Link href="/login" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Login</Link>
                <Link href="/register" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-1 px-4 rounded-full transition-normal">Cadastre-se</Link>
            </div>
        </header>
    )
}