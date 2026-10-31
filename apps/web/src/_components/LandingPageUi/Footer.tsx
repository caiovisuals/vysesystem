"use client"

import Link from "next/link"
import GithubStarsButton from "../GithubStarsButton"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="flex flex-col gap-16 max-[1280px]:gap-12 max-[1024px]:gap-8 p-8 max-[512px]:p-6">
            <div className="flex flex-row flex-wrap gap-32 max-[1280px]:gap-24 max-[1024px]:gap-18 max-[768px]:gap-8">
                <img src="/logo.png" alt="VyseSystem" className="h-[45px] max-[1280px]:h-[38px] max-[768px]:h-[32px] hover:brightness-75 transition-fast" />
                <div className="flex flex-row gap-32 max-[1280px]:gap-24 max-[1024px]:gap-18 max-[768px]:gap-8">
                    <nav className="flex flex-col gap-2">
                        <span className="text-[var(--sub-text)]">Conta</span>
                        <Link href="/register" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Cadastre-se</Link>
                        <Link href="/login" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Login</Link>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <span className="text-[var(--sub-text)]">Plataforma</span>
                        <Link href="/why" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                        <Link href="/documentation" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                        <Link href="/dashboard" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <span className="text-[var(--sub-text)]">Empresa</span>
                        <Link href="/redefine" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Manifesto</Link>
                        <Link href="/clients" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Clientes</Link>
                        <Link href="/careers" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Carreiras</Link>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <span className="text-[var(--sub-text)]">Suporte</span>
                        <Link href="/terms" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Termos de Uso</Link>
                        <Link href="/privacy" className="text-[18px] max-[1280px]:text-[16px] transition-normal hover:text-[var(--sub-text)]">Política de Privacidade</Link>
                    </nav>
                </div>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                <span>Copyright © {currentYear} VyseSystem - Desenvolvido por Caiothedev</span>
                <GithubStarsButton />
            </div>
        </footer>
    )
}