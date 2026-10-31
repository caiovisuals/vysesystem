import { Metadata } from "next"
import Header from "@/_components/LandingPageUi/Header"
import Footer from "@/_components/LandingPageUi/Footer"

import Link from "next/link"

import Affirmation from "@/_components/LandingPageUi/Affirmation"
import Mobile from "@/_components/LandingPageUi/Devices/Mobile"
import Desktop from "@/_components/LandingPageUi/Devices/Desktop"

import IntegrateButton from "@/_components/LandingPageUi/IntegrateButton"
import WhyButton from "@/_components/LandingPageUi/WhyButton"
import CtaButton from "@/_components/LandingPageUi/CtaButton"
import FeatureCard from "@/_components/WhyUi/FeatureCard"
import FaqItem from "@/_components/WhyUi/FaqItem"

export const metadata: Metadata = {
	title: "VyseSystem - Sistema PDV de ERP e CRM para comércios.",
}

const sectionPadding = "px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64"

const stats = [
    { value: "+5 mil", label: "empresários usando a Vyse" },
    { value: "3 min", label: "para registrar o seu negócio" },
    { value: "R$ 0", label: "para começar, sem mensalidade" },
    { value: "3 apps", label: "web, desktop e celular" },
]

const features = [
    {
        title: "Receba do jeito do cliente",
        description: "Dinheiro, PIX, cartão de crédito, cartão de débito e carteiras digitais, tudo registrado na mesma venda.",
        icon: (
            <>
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
            </>
        )
    },
    {
        title: "Números em tempo real",
        description: "Faturamento, ticket médio e rankings atualizados por dia, semana ou mês, sem montar planilha.",
        icon: (
            <>
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
            </>
        )
    },
    {
        title: "Do computador ao celular",
        description: "Venda pelo navegador ou pelo app desktop do caixa (Windows, macOS e Linux) e acompanhe pelo app mobile quando estiver longe da loja.",
        icon: (
            <>
                <rect width="14" height="20" x="5" y="2" rx="2" />
                <path d="M12 18h.01" />
            </>
        )
    },
    {
        title: "Seus dados protegidos",
        description: "Login autenticado, limite de requisições contra abusos e cabeçalhos de segurança em todas as páginas.",
        icon: (
            <>
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
            </>
        )
    },
]

const faq = [
    {
        question: "Quanto custa usar a Vyse?",
        answer: "Nada. A VyseSystem é gratuita: basta criar uma conta para começar a usar todas as funcionalidades.",
    },
    {
        question: "Preciso instalar algum programa?",
        answer: "Não é obrigatório: a plataforma funciona direto no navegador. Se preferir, instale o app desktop no computador do caixa (Windows, macOS e Linux) e acompanhe o negócio pelo app mobile.",
    },
    {
        question: "A Vyse serve para o meu tipo de comércio?",
        answer: "Se você vende produtos e precisa controlar vendas, pedidos e cadastros, a VyseSystem foi feita para você, de pequenas lojas a negócios em crescimento.",
    },
    {
        question: "Meus dados ficam seguros?",
        answer: "Sim. O acesso é protegido por autenticação, as requisições têm limite contra abusos e a aplicação usa cabeçalhos de segurança em todas as páginas.",
    },
]

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            <Header />
            <section id="hero" className="flex flex-row max-[1440px]:flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 max-[1440px]:py-25 gap-16 min-h-[calc(100vh-96px)] max-[1440px]:min-h-0 overflow-hidden">
                <div className="w-[50%] flex flex-col gap-16 max-[1280px]:gap-12 justify-center mb-[100px]">
                    <div className="flex flex-col gap-8 max-[1280px]:gap-6">
                        <Affirmation />
                        <h1 className="text-[68px] max-[768px]:text-[46px] max-[640px]:text-[32px]">
                            Controle fácil, <br className="max-[1440px]:hidden" /> 
                            Cresça rápido.
                        </h1>
                        <h3 className="text-[18px] max-[1024px]:text-[16px] text-[var(--sub-text)] max-w-[520px]">
                            O sistema ERP e CRM que conecta todas as áreas da sua empresa de ponta a ponta. Gratuito e open source!
                        </h3>
                    </div>
                    <div className="flex flex-row gap-4">
                        <IntegrateButton />
                        <WhyButton />
                    </div>
                </div>
                <div className="w-[50%] mb-[100px] max-[1440px]:mb-[50px] relative ">
                    <Desktop />
                    <Mobile />
                </div>
            </section>
            <section id="features" className={`flex flex-col ${sectionPadding} py-24 max-[768px]:py-16 gap-10`}>
                <div className="flex flex-col gap-3">
                    <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[32px]">Feito para o dia a dia de quem vende.</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px] max-w-[640px]">Os recursos que você usa todo dia, sem as telas que só atrapalham.</p>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} {...feature} />
                        ))}
                    </div>
                    <div className="flex flex-row max-[480px]:flex-col items-center gap-4">
                        <IntegrateButton />
                        <span className="text-[var(--sub-text)]">Tudo isso gratuito!</span>
                    </div>
                </div>
            </section>
            <section id="modules" className={`flex flex-col ${sectionPadding} py-24 max-[768px]:py-16 gap-10`}>
                <div className="flex flex-row max-[1024px]:flex-col items-end max-[1024px]:items-start justify-between gap-6">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[32px]">Um sistema, todas as áreas.</h2>
                            <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px] max-w-[640px]">Da venda no balcão ao fechamento fiscal, cada parte do seu comércio conversa com as outras.</p>
                        </div>
                        <Link href="/documentation" className="w-fit shrink-0 flex flex-row items-center gap-2 py-2 px-6 border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] rounded-full transition-normal">
                            Ver documentação
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div></div>
                </div>
            </section>
            <section id="stats" className={`${sectionPadding} py-12`}>
                <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 border-y-2 border-[var(--foreground)]">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-2 py-10 max-[768px]:py-8 px-6 max-[480px]:px-3 text-center">
                            <span className="text-[40px] max-[768px]:text-[30px] text-[var(--text-head)]">{stat.value}</span>
                            <span className="text-[var(--sub-text)] max-[480px]:text-[14px]">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section id="faq" className={`flex flex-row max-[1152px]:flex-col ${sectionPadding} py-24 max-[768px]:py-16 gap-16 max-[1152px]:gap-8`}>
                <div className="w-[40%] max-[1152px]:w-full flex flex-col gap-3">
                    <h2 className="text-[40px] max-[768px]:text-[32px]">Perguntas frequentes</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px] max-w-[480px]">
                        Ainda com dúvidas? Veja mais detalhes em <Link href="/why" className="text-[var(--text)] hover:text-[var(--text-head)] transition-normal">Por que usar?</Link>
                    </p>
                </div>
                <div className="w-[60%] max-[1152px]:w-full flex flex-col">
                    {faq.map((item) => (
                        <FaqItem key={item.question} {...item} />
                    ))}
                </div>
            </section>
            <section id="cta" className={`${sectionPadding} py-24 max-[768px]:py-16`}>
                <div className="lp-cta flex flex-col items-center text-center gap-8 py-20 px-16 max-[768px]:py-14 max-[768px]:px-8 max-[480px]:px-6">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[30px]">Eae empresário? Tá interessado né?</h2>
                        <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px]">O registro do seu negócio leva 3 minutos, e suas primeiras vendas você despacha ainda hoje.</p>
                    </div>
                    <div className="flex flex-row max-[480px]:flex-col max-[480px]:w-full gap-4">
                        <CtaButton />
                        <Link href="/login" className="text-center py-2 px-6 rounded-full transition-normal hover:text-[var(--sub-text)]">
                            Já tenho conta
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}