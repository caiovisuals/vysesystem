import { Metadata } from "next"
import Link from "next/link"

import IntegrateButton from "@/_components/ClientsUi/IntegrateButton"

export const metadata: Metadata = {
	title: "VyseSystem - Clientes",
    description: "Conheça os comércios que gerenciam vendas, clientes e estoque com a VyseSystem.",
}

const clients = [
    "Mercado Bom Preço",
    "Padaria Trigo Fino",
    "Ótica Visão",
    "Pet Feliz",
    "Casa & Construção",
    "Farmácia Vida",
    "Moda Urbana",
    "Empório Natural",
    "Tech Store",
    "Açaí da Praça",
    "Livraria Página",
    "Auto Peças Rota",
]

const stats = [
    { value: "+5 mil", label: "empresas ativas" },
    { value: "+1 mi", label: "vendas registradas" },
    { value: "+200 mil", label: "clientes cadastrados" },
    { value: "27", label: "estados atendidos" },
]

const testimonials = [
    {
        quote: "Antes eu fechava o caixa no caderno. Hoje vejo o faturamento do dia pelo celular antes mesmo de sair da loja.",
        name: "Mariana Costa",
        role: "Dona da Padaria Trigo Fino",
    },
    {
        quote: "O cadastro de clientes mudou nosso atendimento. A gente sabe quem compra o quê e chama a pessoa pelo nome.",
        name: "Rafael Souza",
        role: "Gerente do Pet Feliz",
    },
    {
        quote: "Coloquei a loja inteira no ar em uma tarde. Sem instalar nada, sem pagar nada e sem precisar de técnico.",
        name: "Juliana Alves",
        role: "Sócia da Moda Urbana",
    },
]

const segments = [
    "Mercados e mercearias",
    "Padarias e confeitarias",
    "Lojas de roupas",
    "Pet shops",
    "Farmácias",
    "Materiais de construção",
    "Eletrônicos",
    "Food service",
]

export default function Clients() {
    return (
        <div className="flex-1 flex flex-col">
            <section id="clients-hero" className="flex flex-col items-center text-center px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-42 max-[1280px]:py-34 max-[1024px]:py-26 max-[768px]:py-18 gap-8">
                <h1 className="text-[68px] max-[1024px]:text-[52px] max-[768px]:text-[40px] max-[480px]:text-[32px] max-w-[1000px]">
                    O CRM por trás de <span className="text-[var(--text-head)]">milhares de empresas.</span>
                </h1>
                <p className="text-[18px] max-[1024px]:text-[16px] text-[var(--sub-text)] max-w-[640px]">
                    De padarias de bairro a redes de lojas, comércios de todo o Brasil usam a Vyse para vender, cadastrar e se relacionar melhor com seus clientes.
                </p>
            </section>
            <section id="clients-range" className="flex flex-col items-center px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-10">
                <div className="grid w-full max-w-7xl grid-cols-6 gap-4 max-xl:grid-cols-4 max-md:grid-cols-3 max-[480px]:grid-cols-2">
                    {clients.map((client) => (
                        <div key={client} className="h-20 flex items-center justify-center px-3 text-center border-2 border-[var(--foreground)] hover:border-[var(--middleground)] rounded-[18px] text-[var(--sub-text)] hover:text-[var(--text)] transition-normal">
                            <span className="text-[15px] leading-tight">{client}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section id="clients-stats" className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-12">
                <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 border-y-2 border-[var(--foreground)]">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-2 py-10 max-[768px]:py-8 px-6 max-[480px]:px-3 text-center">
                            <span className="text-[40px] max-[768px]:text-[30px] text-[var(--text-head)]">{stat.value}</span>
                            <span className="text-[var(--sub-text)] max-[480px]:text-[14px]">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section id="clients-testimonials" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-24 max-[768px]:py-16 gap-10">
                <div className="flex flex-col gap-3">
                    <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[32px]">Quem usa, recomenda.</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px] max-w-[640px]">Histórias de quem trocou o caderno e a planilha pela Vyse.</p>
                </div>
                <div className="grid grid-cols-3 max-[1152px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6">
                    {testimonials.map((testimonial) => (
                        <figure key={testimonial.name} className="flex flex-col justify-between gap-8 p-8 max-[480px]:p-6 bg-[var(--second-background)] border-2 border-[var(--foreground)] hover:border-[var(--middleground)] rounded-[24px] transition-normal">
                            <blockquote className="text-[18px]">“{testimonial.quote}”</blockquote>
                            <figcaption className="flex flex-col gap-1">
                                <span>{testimonial.name}</span>
                                <span className="text-[14px] text-[var(--sub-text)]">{testimonial.role}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>
            <section id="clients-segments" className="flex flex-row max-[1152px]:flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-16 max-[1152px]:gap-8">
                <div className="w-[40%] max-[1152px]:w-full flex flex-col gap-3">
                    <h2 className="text-[40px] max-[768px]:text-[32px]">Feito para todo tipo de comércio</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px] max-w-[480px]">Se você vende produtos e atende pessoas, a Vyse se adapta ao seu negócio.</p>
                </div>
                <div className="w-[60%] max-[1152px]:w-full flex flex-row flex-wrap content-start gap-3">
                    {segments.map((segment) => (
                        <span key={segment} className="py-2 px-5 border-2 border-[var(--foreground)] rounded-full">{segment}</span>
                    ))}
                </div>
            </section>
            <section id="clients-cta" className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-24 max-[768px]:py-16">
                <div className="flex flex-col items-center text-center gap-8 py-20 px-16 max-[768px]:py-14 max-[768px]:px-8 max-[480px]:px-6">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[30px]">Seu negócio pode ser o próximo.</h2>
                        <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px]">Crie sua conta gratuita e comece a registrar suas vendas ainda hoje.</p>
                    </div>
                    <div className="flex flex-row max-[480px]:flex-col max-[480px]:w-full gap-4">
                        <IntegrateButton />
                        <Link href="/redefine" className="text-center border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] py-2 px-6 rounded-full transition-normal">
                            Conheça a Vyse
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}