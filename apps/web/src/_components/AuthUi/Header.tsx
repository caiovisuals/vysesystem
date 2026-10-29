import Link from "next/link"

export default function Header() {
    return (
        <header className="flex flex-row items-center justify-between p-8 max-[512px]:p-6">
            <Link href="/">
                <img src="/logo.png" alt="VyseSystem" className="h-[25px]" />
            </Link>
            <div className="flex flex-row gap-4">
                <Link href="/documentation" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Documentação</Link>
                <Link href="/why" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Por que usar?</Link>
                <Link href="/dashboard" className="text-center py-1 px-4 rounded-full transition-normal hover:text-[var(--sub-text)]">Acessar a Plataforma</Link>
            </div>
        </header>
    )
}