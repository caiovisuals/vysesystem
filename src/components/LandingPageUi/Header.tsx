"use client"

import Link from "next/link"

export default function Header() {
    return (
        <header className="p-8 flex flex-row items-center justify-between">
            <Link href="/">
                <img src="/logo.png" alt="logo" className="h-[25px]"/>
            </Link>
            <div className="flex flex-row gap-4">
                <Link href="/documentation" className="py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Documentação</Link>
                <Link href="/why" className="py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Por que usar?</Link>
                <Link href="/dashboard" className="py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                <div className="h-auto w-0.5 bg-[var(--middleground)]"/>
                <Link href="/login" className="py-1 px-4 rounded-full transition-all duration-300 ease-in-out hover:text-[var(--sub-text)]">Login</Link>
                <Link href="/register" className="bg-[var(--foreground)] hover:bg-[var(--middleground)] py-1 px-4 rounded-full transition-all duration-300 ease-in-out">Cadastre-se</Link>
            </div>
        </header>
    )
}