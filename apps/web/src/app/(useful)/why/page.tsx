import { Metadata } from "next"
import Link from "next/link"

import IntegrateButton from "@/_components/LandingPageUi/IntegrateButton"
import FeatureCard from "@/_components/WhyUi/FeatureCard"
import StepItem from "@/_components/WhyUi/StepItem"
import FaqItem from "@/_components/WhyUi/FaqItem"

export const metadata: Metadata = {
	title: "VyseSystem - Por que usar?",
    description: "Vendas, pedidos, cadastros e fiscal em um só lugar. Descubra por que a VyseSystem é o ERP/CRM certo para o seu comércio.",
}

const features = [
    {
        title: "Vendas no ritmo do balcão",
        description: "Registre vendas em poucos cliques e acompanhe o faturamento do dia em tempo real, sem planilhas paralelas.",
        icon: (
            <>
                <path d="M16 7h6v6" />
                <path d="m22 7-8.5 8.5-5-5L2 17" />
            </>
        )
    },
    {
        title: "Pedidos sob controle",
        description: "Saiba o que está em aberto, o que já saiu e o que precisa de atenção. Nada se perde entre o pedido e a entrega.",
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
        title: "Cadastros centralizados",
        description: "Produtos, clientes, fornecedores e colaboradores organizados em um só lugar, com busca e filtros rápidos.",
        icon: (
            <>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
            </>
        )
    },
    {
        title: "Fiscal sem dor de cabeça",
        description: "Relatórios e registros fiscais reunidos para você fechar o mês com tranquilidade e menos retrabalho.",
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
    {
        title: "Do computador ao celular",
        description: "Acesse a plataforma pelo navegador ou pelo app mobile e acompanhe seu negócio de onde estiver.",
        icon: (
            <>
                <rect width="14" height="20" x="5" y="2" rx="2" />
                <path d="M12 18h.01" />
            </>
        )
    },
    {
        title: "Segurança em primeiro lugar",
        description: "Autenticação protegida, limite de requisições e cabeçalhos de segurança cuidando dos dados da sua empresa.",
        icon: (
            <>
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
            </>
        )
    },
]

const comparison = [
    {
        before: "Vendas anotadas em caderno ou planilhas espalhadas",
        after: "Todas as vendas registradas e visíveis no painel",
    },
    {
        before: "Estoque e cadastros desatualizados",
        after: "Produtos, clientes e fornecedores sempre em dia",
    },
    {
        before: "Horas fechando relatórios no fim do mês",
        after: "Relatórios prontos quando você precisar",
    },
    {
        before: "Informação presa em um único computador",
        after: "Acesso pelo navegador e pelo celular",
    },
]

const steps = [
    {
        title: "Crie sua conta",
        description: "O cadastro é rápido e gratuito. Em poucos minutos você já está dentro da plataforma.",
    },
    {
        title: "Configure sua empresa",
        description: "Cadastre seus produtos, clientes, fornecedores e colaboradores do jeito que o seu negócio funciona.",
    },
    {
        title: "Comece a vender",
        description: "Registre vendas e pedidos e acompanhe tudo pelo Painel de Gestão, no computador ou no celular.",
    },
]

const faq = [
    {
        question: "Quanto custa usar a Vyse?",
        answer: "Nada. A VyseSystem é gratuita: basta criar uma conta para começar a usar todas as funcionalidades.",
    },
    {
        question: "Preciso instalar algum programa?",
        answer: "Não. A plataforma funciona direto no navegador, e você também pode acompanhar seu negócio pelo app mobile.",
    },
    {
        question: "A Vyse serve para o meu tipo de comércio?",
        answer: "Se você vende produtos e precisa controlar vendas, pedidos e cadastros, a VyseSystem foi feita para você, de pequenas lojas a negócios em crescimento.",
    },
    {
        question: "Meus dados ficam seguros?",
        answer: "Sim. O acesso é protegido por autenticação, as requisições têm limite contra abusos e a aplicação usa cabeçalhos de segurança em todas as páginas.",
    },
    {
        question: "Onde aprendo a usar cada funcionalidade?",
        answer: "Na página de Documentação você encontra guias sobre autenticação, produtos, clientes, fornecedores, colaboradores, relatórios e muito mais.",
    },
]

export default function Why() {
    return (
        <div className="flex-1 flex flex-col">
            <section id="why-hero" className="flex flex-col items-center text-center px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-32 max-[1024px]:py-24 max-[768px]:py-16 gap-8">
                <h1 className="text-[60px] max-[1024px]:text-[48px] max-[768px]:text-[38px] max-w-[900px]">
                    Menos tempo gerenciando, mais tempo vendendo.
                </h1>
                <h3 className="text-[18px] text-[var(--sub-text)] max-w-[640px]">
                    A VyseSystem reúne vendas, pedidos, cadastros e fiscal em uma única plataforma, para você ter o controle do seu comércio sem complicação.
                </h3>
                <div className="flex flex-row max-[480px]:flex-col gap-4">
                    <IntegrateButton />
                    <Link href="/documentation" className="text-center border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] py-2 px-6 rounded-full transition-normal">
                        Ver documentação
                    </Link>
                </div>
            </section>
            <section id="why-features" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-10">
                <div className="flex flex-col gap-3">
                    <h2 className="text-[40px] max-[768px]:text-[32px]">Tudo o que seu negócio precisa</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-w-[640px]">Ferramentas pensadas para o dia a dia de quem vende, sem recursos que só atrapalham.</p>
                </div>
                <div className="grid grid-cols-3 max-[1152px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </section>
            <section id="why-comparison" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-10">
                <div className="flex flex-col gap-3">
                    <h2 className="text-[40px] max-[768px]:text-[32px]">Antes e depois da Vyse</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-w-[640px]">Veja o que muda na rotina do seu comércio.</p>
                </div>
                <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-6">
                    <div className="flex flex-col gap-3 p-8 max-[480px]:p-6 border-2 border-[var(--foreground)] rounded-[24px]">
                        <span className="text-[var(--sub-text)]">Sem a VyseSystem</span>
                        {comparison.map((item) => (
                            <div key={item.before} className="flex flex-row gap-3 items-start text-[var(--sub-text)]">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                                <span>{item.before}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 p-8 max-[480px]:p-6 bg-[var(--second-background)] border-2 border-[var(--middleground)] rounded-[24px]">
                        <span className="text-[var(--text-head)]">Com a VyseSystem</span>
                        {comparison.map((item) => (
                            <div key={item.after} className="flex flex-row gap-3 items-start">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-head)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                <span>{item.after}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section id="why-steps" className="flex flex-row max-[1152px]:flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-16 max-[1152px]:gap-10">
                <div className="w-[40%] max-[1152px]:w-full flex flex-col gap-3">
                    <h2 className="text-[40px] max-[768px]:text-[32px]">Comece em minutos</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-w-[480px]">Sem instalação, sem burocracia. Em três passos sua empresa já está rodando na Vyse.</p>
                </div>
                <div className="w-[60%] max-[1152px]:w-full flex flex-col gap-8">
                    {steps.map((step, index) => (
                        <StepItem key={step.title} step={index + 1} {...step} />
                    ))}
                </div>
            </section>
            <section id="why-faq" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-6">
                <h2 className="text-[40px] max-[768px]:text-[32px]">Perguntas frequentes</h2>
                <div className="flex flex-col">
                    {faq.map((item) => (
                        <FaqItem key={item.question} {...item} />
                    ))}
                </div>
            </section>
            <section id="why-cta" className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-24 max-[1024px]:py-16">
                <div className="flex flex-col items-center text-center gap-6 p-16 max-[768px]:p-8">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-[40px] max-[768px]:text-[30px]">Pronto para ter o controle do seu negócio?</h2>
                        <p className="text-[var(--sub-text)] text-[18px]">Crie sua conta gratuita e descubra como é simples gerenciar seu comércio com a VyseSystem.</p>
                    </div>
                    <div className="flex flex-row max-[480px]:flex-col gap-4">
                        <Link href="/register" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-2 px-6 rounded-full transition-normal">
                            Cadastre-se grátis
                        </Link>
                        <Link href="/login" className="text-center py-2 px-6 rounded-full transition-normal hover:text-[var(--sub-text)]">
                            Já tenho conta
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}