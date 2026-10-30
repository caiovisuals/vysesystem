import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "VyseSystem - Carreiras",
    description: "Venha construir com a gente a plataforma que automatiza a receita de milhares de comércios.",
}

export default function Careers() {
    return (
        <div className="flex-1 flex flex-col">
            <section id="careers-hero" className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-32 max-[1024px]:py-24 max-[768px]:py-16 gap-10 min-h-[calc(100vh-96px)] max-[1024px]:min-h-0">
                <div className="flex flex-col gap-8">
                    <h1 className="text-[68px] max-[1024px]:text-[52px] max-[768px]:text-[40px] max-[480px]:text-[32px] max-w-[1000px]">
                        Nossa missão é construir a plataforma para <span className="text-[var(--text-head)]">receita automática.</span>
                    </h1>
                    <p className="text-[18px] max-[1024px]:text-[16px] text-[var(--sub-text)] max-w-[640px]">
                        Milhares de comércios já registram suas vendas na Vyse. Agora queremos que cada um deles venda mais sem trabalhar mais. Se você gosta de resolver problemas reais de quem empreende, tem um lugar para você aqui.
                    </p>
                </div>
                <Link href="/redefine" className="group w-fit flex flex-row items-center gap-2 text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-2 px-6 rounded-full transition-normal">
                    Leia nosso manifesto
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-normal group-hover:translate-x-1">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </Link>
            </section>
        </div>
    )
}