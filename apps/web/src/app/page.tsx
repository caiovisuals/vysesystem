import { Metadata } from "next"
import Header from "@/_components/LandingPageUi/Header"
import Footer from "@/_components/LandingPageUi/Footer"

import Link from "next/link"

import Mobile from "@/_components/LandingPageUi/Devices/Mobile"
import Desktop from "@/_components/LandingPageUi/Devices/Desktop"

import IntegrateButton from "@/_components/LandingPageUi/IntegrateButton"
import WhyButton from "@/_components/LandingPageUi/WhyButton"
import CtaButton from "@/_components/LandingPageUi/CtaButton"
import ModuleCard from "@/_components/LandingPageUi/ModuleCard"
import StepItem from "@/_components/WhyUi/StepItem"
import FaqItem from "@/_components/WhyUi/FaqItem"

export const metadata: Metadata = {
	title: "VyseSystem - Sistema PDV de ERP para comércios.",
}

const sectionPadding = "px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64"

const stats = [
    { value: "+5 mil", label: "empresários usando a Vyse" },
    { value: "3 min", label: "para registrar o seu negócio" },
    { value: "R$ 0", label: "para começar, sem mensalidade" },
    { value: "Web + App", label: "acesso do computador ao celular" },
]

const modules = [
    {
        tag: "Vendas",
        title: "Feche vendas no balcão",
        description: "Monte o carrinho, escolha a forma de pagamento e finalize a venda em poucos cliques.",
        items: ["Faturamento do dia, semana e mês", "Ticket médio e formas de pagamento", "Ranking de produtos, clientes e vendedores"],
        icon: (
            <>
                <path d="M16 7h6v6" />
                <path d="m22 7-8.5 8.5-5-5L2 17" />
            </>
        )
    },
    {
        tag: "Pedidos",
        title: "Acompanhe cada pedido",
        description: "Saiba o que está em aberto, o que já saiu e o que precisa da sua atenção agora.",
        items: ["Status de cada pedido em tempo real", "Histórico completo por cliente", "Nada se perde entre o pedido e a entrega"],
        icon: (
            <>
                <path d="M3.5 5.5 5 7l2.5-2.5" />
                <path d="m3.5 12 1.5 1.5L7.5 11" />
                <path d="M3.5 18.5 5 20l2.5-2.5" />
                <path d="M11 6h9" />
                <path d="M11 12h9" />
                <path d="M11 18h9" />
            </>
        )
    },
    {
        tag: "Cadastros",
        title: "Tudo organizado em um lugar",
        description: "Produtos, clientes, fornecedores e colaboradores com busca e filtros rápidos.",
        items: ["Catálogo de produtos com preços e estoque", "Base de clientes e fornecedores", "Equipe com acessos por colaborador"],
        icon: (
            <>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
            </>
        )
    },
    {
        tag: "Fiscal",
        title: "Feche o mês sem dor de cabeça",
        description: "Registros e relatórios fiscais reunidos para você ter menos retrabalho no fim do mês.",
        items: ["Relatórios prontos quando precisar", "Registros fiscais centralizados", "Menos planilhas paralelas"],
        icon: (
            <>
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                <path d="M8 18v-1" />
                <path d="M12 18v-6" />
                <path d="M16 18v-3" />
            </>
        )
    },
]

const steps = [
    {
        title: "Crie sua conta",
        description: "Cadastro rápido e gratuito, sem cartão de crédito.",
    },
    {
        title: "Configure sua empresa",
        description: "Cadastre produtos, clientes e colaboradores do seu jeito.",
    },
    {
        title: "Comece a vender",
        description: "Registre vendas e acompanhe tudo no Painel de Gestão.",
    },
]

const faq = [
    {
        question: "Quanto custa usar a VyseSystem?",
        answer: "Nada. A VyseSystem é gratuita: basta criar uma conta para começar a usar todas as funcionalidades.",
    },
    {
        question: "Preciso instalar algum programa?",
        answer: "Não. A plataforma funciona direto no navegador, e você também pode acompanhar seu negócio pelo app mobile.",
    },
    {
        question: "A VyseSystem serve para o meu tipo de comércio?",
        answer: "Se você vende produtos e precisa controlar vendas, pedidos e cadastros, a VyseSystem foi feita para você — de pequenas lojas a negócios em crescimento.",
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
                <div className="w-[50%] flex flex-col gap-16 justify-center mb-[100px]">
                    <div className="flex flex-col gap-8">
                        <div className="w-fit py-2 px-3 flex flex-row gap-2.5 border-2 border-[var(--middleground)] rounded-full items-center">
                            <div className="flex flex-row">
                                <img src="/landingpage/profile1.jpg" alt="user-profile" className="size-[25px] rounded-full object-cover aspect-square border-2 border-[var(--background)]" />
                                <img src="/landingpage/profile2.jpg" alt="user-profile" className="size-[25px] rounded-full object-cover aspect-square border-2 border-[var(--background)] -ml-2" />
                                <img src="/landingpage/profile3.jpg" alt="user-profile" className="size-[25px] rounded-full object-cover aspect-square border-2 border-[var(--background)] -ml-2" />
                            </div>
                            <span className="whitespace-nowrap text-[15px] pr-1">Escolhido por +5 mil empresários</span>
                        </div>
                        <h1 className="text-[68px]">
                            Controle fácil, <br className="max-[1440px]:hidden" /> 
                            Cresça rápido.
                        </h1>
                        <h3 className="text-[18px] text-[var(--sub-text)] max-w-[520px]">O sistema ERP que conecta todas as áreas da sua empresa de ponta a ponta.</h3>
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
            <section id="features" className="">
                <div className="flex flex-col gap-3">
                    <h2></h2>
                    <p></p>
                </div>
                <div>
                    <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6">

                    </div>
                    <IntegrateButton />
                </div>
            </section>
            <section id="modules" className={`flex flex-col ${sectionPadding} py-24 max-[768px]:py-16 gap-10`}>
                <div className="flex flex-row max-[1024px]:flex-col items-end max-[1024px]:items-start justify-between gap-6">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[32px]">Um sistema, todas as áreas.</h2>
                            <p className="text-[var(--sub-text)] text-[18px] max-w-[640px]">Da venda no balcão ao fechamento fiscal, cada parte do seu comércio conversa com as outras.</p>
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
                    <p className="text-[var(--sub-text)] text-[18px] max-w-[480px]">
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
                        <p className="text-[var(--sub-text)] text-[18px]">O registro do seu negócio leva 3 minutos, e suas primeiras vendas você despacha ainda hoje.</p>
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