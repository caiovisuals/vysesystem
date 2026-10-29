import Link from "next/link"
import { Metadata } from "next"
import ClearSession from "@/_components/OutUi/ClearSession"

export const metadata: Metadata = {
    title: "Conta excluída - VyseSystem",
    robots: {
        index: false,
        follow: false,
    },
}

export default function AccountDeleted() {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <ClearSession />
            <header className="p-8 flex flex-row items-center justify-between">
                <Link href="/">
                    <img src="/logo.png" alt="VyseSystem" className="h-[25px]" />
                </Link>
                <div className="hidden sm:flex flex-row gap-4">
                    <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                    <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center px-4 pb-8">
                <div className="flex flex-col items-center text-center gap-6 w-full max-w-[520px]">
                    <div className="size-16 flex items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--text-head)]">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 21a8 8 0 0 1 11.873-7" />
                            <circle cx="10" cy="8" r="5" />
                            <path d="m17 17 5 5" />
                            <path d="m22 17-5 5" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[34px] leading-tight">Sua conta foi excluída</h1>
                        <span className="text-[var(--sub-text)] text-[18px]">
                            Sentiremos sua falta! Sua conta e os dados vinculados a ela foram removidos do VyseSystem e sua sessão foi encerrada em todos os dispositivos.
                        </span>
                    </div>
                    <div className="w-full flex flex-col gap-3 p-5 bg-[var(--second-background)] border-2 border-[var(--foreground)] rounded-[24px] text-left">
                        <h2 className="text-[18px] font-medium">O que acontece agora?</h2>
                        <ul className="flex flex-col gap-2 text-[var(--sub-text)]">
                            <li>• Você não receberá mais e-mails ou notificações da plataforma.</li>
                            <li>• Empresas, vendas e cadastros vinculados à conta não poderão ser recuperados.</li>
                            <li>• Seu nome de usuário e e-mail ficam livres para um novo cadastro.</li>
                        </ul>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/"
                            className="flex-1 border-2 border-transparent bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[18px] py-2 px-3 rounded-[15px] transition-fast"
                        >
                            Voltar para o início
                        </Link>
                        <Link
                            href="/register"
                            className="flex-1 border-2 border-[var(--foreground)] hover:border-[var(--middleground)] text-[18px] py-2 px-3 rounded-[15px] transition-fast"
                        >
                            Criar nova conta
                        </Link>
                    </div>
                    <span className="text-[var(--sub-text)] text-sm">
                        Ficou com alguma dúvida? Consulte a <Link href="/documentation" className="text-[var(--text-head)]">documentação</Link>.
                    </span>
                </div>
            </main>
        </div>
    )
}