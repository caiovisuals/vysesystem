"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isCompanyOpen, setIsCompanyOpen] = useState(false)
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    function openCompany() {
        if (closeTimeout.current) clearTimeout(closeTimeout.current)
        setIsCompanyOpen(true)
    }

    // pequeno atraso para o mouse conseguir atravessar o espaço entre o botão e o menu
    function closeCompany() {
        if (closeTimeout.current) clearTimeout(closeTimeout.current)
        closeTimeout.current = setTimeout(() => setIsCompanyOpen(false), 150)
    }

    useEffect(() => {
        return () => {
            if (closeTimeout.current) clearTimeout(closeTimeout.current)
        }
    }, [])

    return (
        <header className="relative z-[100] flex flex-row items-center justify-between gap-2 p-8 max-[512px]:p-6">
            <Link href="/">
                <img src="/logo.png" alt="VyseSystem"  className="h-[25px] hover:brightness-75 transition-fast" />
            </Link>
            <div className="flex max-[1152px]:hidden flex-row md:gap-3 gap-4">
                <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                <div onMouseEnter={openCompany} onMouseLeave={closeCompany} onFocus={openCompany} onBlur={closeCompany} className="relative flex items-center justify-center">
                    <button type="button" onClick={() => setIsCompanyOpen(!isCompanyOpen)} aria-expanded={isCompanyOpen} aria-haspopup="true" className="group py-1 px-4 flex flex-row items-center justify-center gap-1 rounded-full cursor-pointer">
                        <span className="text-center transition-normal group-hover:text-[var(--sub-text)]">Empresa</span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className={`transition-normal ${isCompanyOpen ? "rotate-90" : ""}`}>
                            <path d="M5.25 7.125 9 10.875l3.75-3.75" />
                        </svg>
                    </button>
                    <div className={`absolute top-full right-0 w-56 z-[110] transition-normal ${isCompanyOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                        <div className="pt-3">
                            <div className="flex flex-col gap-1 p-2 rounded-2xl bg-[#171717] border-2 border-[var(--middleground)] shadow-xl">
                                <span className="px-3 pt-1 text-start text-[14px] text-[var(--sub-text)]">Empresa</span>
                                <Link href="/redefine" className="px-3 py-1 rounded-xl hover:bg-[#292929] transition-normal">
                                    Manifesto
                                </Link>
                                <Link href="/clients" className="px-3 py-1 rounded-xl hover:bg-[#292929] transition-normal">
                                    Clientes
                                </Link>
                                <Link href="/careers" className="px-3 py-1 rounded-xl hover:bg-[#292929] transition-normal">
                                    Carreiras
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                <div className="h-auto w-0.5 bg-[var(--middleground)]" />
                <Link href="/login" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Login</Link>
                <Link href="/register" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-1 px-4 rounded-full transition-normal">Cadastre-se</Link>
            </div>
            <div aria-label="Abrir menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="hidden max-[1152px]:flex rounded-full bg-[#3a3a3a] hover:bg-[#444] p-[7px] transition-normal cursor-pointer">
                <svg height="28" width="28" viewBox="0 0 24 24" fill="white">
                    <path d="M20 5H4a1 1 0 000 2h16a1 1 0 100-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Z" />
                </svg>
            </div>
            <div onClick={() => setIsOpen(false)} className={`fixed hidden max-[1152px]:flex inset-[0] size-full nav-mobile-overlay z-[200] transition-normal ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0" }`}>
                <div onClick={(event) => event.stopPropagation()} className={`fixed flex flex-col h-full w-[95%] max-[320px]:w-full right-[0px] p-[30px] bg-[#101010] rounded-l-[30px] z-[201] transition-normal transform ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-75" }`}>
                    <div className="mb-10 flex flex-row items-center justify-between">
                        <a aria-label="Fechar menu" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-[7px] bg-[#3a3a3a] hover:bg-[#444] rounded-full transition-normal cursor-pointer">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </a>    
                    </div>
                    <nav className="flex flex-col gap-3 items-start justify-center text-start">
                        <Link href="/login" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Login</Link>
                        <Link href="/register" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-1 px-4 rounded-full transition-normal">Cadastre-se</Link>
                        <div className="w-60 h-0.5 bg-[var(--middleground)]" />
                        <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                        <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                        <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                        <div className="w-60 h-0.5 bg-[var(--middleground)]" />
                        <Link href="/redefine" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Manifesto</Link>
                        <Link href="/clients" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Clientes</Link>
                        <Link href="/careers" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Carreiras</Link>
                        <div className="w-60 h-0.5 bg-[var(--middleground)]" />
                        <Link href="/terms" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Termos de Uso</Link>
                        <Link href="/privacy" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Política de Privacidade</Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}