"use client"

import { useState } from "react"
import Link from "next/link"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="p-8 flex flex-row items-center justify-between">
            <Link href="/">
                <img src="/logo.png" alt="logo" className="h-[25px] hover:brightness-75 transition-fast"/>
            </Link>
            <div className="flex max-[1152px]:hidden flex-row md:gap-3 gap-4">
                <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                <Link href="/terms" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Termos de Uso</Link>
                <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                <div className="h-auto w-0.5 bg-[var(--middleground)]"/>
                <Link href="/login" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Login</Link>
                <Link href="/register" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-1 px-4 rounded-full transition-normal">Cadastre-se</Link>
            </div>
            <div onClick={() => setIsOpen(!isOpen)} className="hidden max-[1152px]:flex rounded-full bg-[#3a3a3a] hover:bg-[#444] p-[7px] transition-normal cursor-pointer">
                <svg height="28" width="28" viewBox="0 0 24 24" fill="white">
                    <path d="M20 5H4a1 1 0 000 2h16a1 1 0 100-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Z"/>
                </svg>
            </div>
            <div className={`fixed hidden max-[1152px]:flex inset-[0] size-full nav-mobile-overlay z-[200] transition-normal ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0" }`}>
                <div className={`fixed flex flex-col h-full w-[95%] max-[320px]:w-full right-[0px] p-[30px] bg-[#101010] rounded-l-[30px] z-[201] transition-normal transform ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-75" }`}>
                    <div className="mb-10 flex flex-row items-center justify-between">
                        <a onClick={() => setIsOpen(false)} className="flex items-center justify-center p-[7px] bg-[#3a3a3a] hover:bg-[#444] rounded-full transition-normal cursor-pointer">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </a>    
                    </div>
                    <nav className="flex flex-col gap-3 items-start justify-center text-start">
                        <Link href="/login" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Login</Link>
                        <Link href="/register" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-1 px-4 rounded-full transition-normal">Cadastre-se</Link>
                        <div className="w-60 h-0.5 bg-[var(--middleground)]"/>
                        <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                        <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                        <Link href="/terms" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Termos de Uso</Link>
                        <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}