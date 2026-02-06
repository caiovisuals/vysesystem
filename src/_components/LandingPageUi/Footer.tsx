"use client"

import Link from "next/link"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="p-8 flex flex-col gap-16">
            <div className="flex flex-row gap-32">
                <img src="/logo.png" alt="logo" className="h-[45px]"/>
                <nav className="flex flex-col gap-2">
                    <span className="text-[var(--sub-text)]">Conta</span>
                    <Link href="/register" className="text-[18px] transition-normal hover:text-[var(--sub-text)]">Cadastre-se</Link>
                    <Link href="/login" className="text-[18px] transition-normal hover:text-[var(--sub-text)]">Login</Link>
                </nav>
                <nav className="flex flex-col gap-2">
                    <span className="text-[var(--sub-text)]">Website</span>
                    <Link href="/documentation" className="text-[18px] transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                    <Link href="/why" className="text-[18px] transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                    <Link href="/dashboard" className="text-[18px] transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                </nav>
            </div>
            <div className="flex flex-row items-center justify-between">
                <span>Copyright © {currentYear} VyseSystem</span>
            </div>
        </footer>
    )
}