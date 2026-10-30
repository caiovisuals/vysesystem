import { Metadata } from "next"
import Link from "next/link"

import CtaButton from "@/_components/RedefineUi/CtaButton"

export const metadata: Metadata = {
	title: "VyseSystem - Manifesto",
    description: "O manifesto da Vyse: por que acreditamos que o relacionamento com o cliente é o centro de todo negócio.",
}

const beliefs = [
    {
        title: "O cliente não é um registro.",
        description: "Por trás de cada linha da tabela existe uma pessoa que escolheu comprar de você. Um bom sistema lembra disso e ajuda você a lembrar também.",
    },
    {
        title: "Simplicidade é respeito.",
        description: "Quem está no balcão não tem tempo para manual. Cada tela da Vyse é pensada para ser entendida no primeiro uso, sem treinamento e sem consultoria.",
    },
    {
        title: "Ferramenta boa não cobra pedágio.",
        description: "Organizar o próprio negócio não deveria ser privilégio de quem pode pagar caro. Por isso a Vyse é gratuita e open source.",
    },
    {
        title: "Dados servem para decidir.",
        description: "Relatório que ninguém lê é só peso. Mostramos o que importa: quanto entrou, quem comprou, o que vendeu e o que precisa de atenção.",
    },
    {
        title: "Tudo conversa com tudo.",
        description: "Venda, estoque, cliente e fiscal são partes da mesma história. Quando um muda, os outros sabem, sem planilha paralela no meio.",
    },
    {
        title: "Construído junto.",
        description: "A Vyse evolui com quem usa. Cada sugestão, cada bug reportado e cada contribuição no código faz parte do que somos.",
    },
]

export default function Redefine() {
    return (
        <div className="flex-1 flex flex-col">
            <section id="manifesto-hero" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-32 max-[1024px]:py-24 max-[768px]:py-16 gap-8">
                <h1 className="text-[68px] max-[1024px]:text-[52px] max-[768px]:text-[40px] max-[480px]:text-[32px] max-w-[1000px]">
                    VyseCRM.<br />
                    <span className="text-[var(--text-head)]">A magia do relacionamento com o cliente.</span>
                </h1>
                <p className="text-[18px] max-[1024px]:text-[16px] text-[var(--sub-text)] max-w-[640px]">
                    Acreditamos que todo negócio, do mercadinho da esquina à rede de lojas, cresce pelo mesmo motivo: pessoas que voltam. Este é o nosso compromisso com quem vende e com quem compra.
                </p>
            </section>
            <section id="manifesto-statement" className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16">
                <div className="flex flex-col gap-6 py-16 max-[768px]:py-10 border-y-2 border-[var(--foreground)]">
                    <p className="text-[36px] max-[1024px]:text-[30px] max-[768px]:text-[24px] leading-tight max-w-[1100px]">
                        Sistemas de gestão foram feitos para contar estoque. <span className="text-[var(--sub-text)]">Nós decidimos construir um que entende pessoas.</span> Porque a venda acaba no caixa, mas o relacionamento começa ali.
                    </p>
                </div>
            </section>
            <section id="manifesto-beliefs" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-16 gap-10">
                <div className="flex flex-col gap-3">
                    <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[32px]">No que acreditamos</h2>
                    <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px] max-w-[640px]">Seis ideias que guiam cada decisão de produto, de design e de código.</p>
                </div>
                <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-x-16 gap-y-12">
                    {beliefs.map((belief, index) => (
                        <div key={belief.title} className="flex flex-col gap-3 pt-6 border-t-2 border-[var(--foreground)]">
                            <span className="text-[var(--text-head)]">{String(index + 1).padStart(2, "0")}</span>
                            <h3 className="text-[26px] max-[768px]:text-[22px]">{belief.title}</h3>
                            <p className="text-[var(--sub-text)] max-w-[520px]">{belief.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section id="manifesto-signature" className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-24 max-[768px]:py-16 gap-6">
                <p className="text-[22px] max-[768px]:text-[18px] text-[var(--sub-text)] max-w-[760px]">
                    Não queremos ser mais um sistema que você aprende a tolerar. Queremos ser a ferramenta que faz o seu cliente voltar, e que faz você ter vontade de abrir a loja amanhã.
                </p>
                <span className="text-[18px]">Equipe Vyse</span>
            </section>
            <section id="manifesto-cta" className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64 py-24 max-[768px]:py-16">
                <div className="flex flex-col items-center text-center gap-8 py-20 px-16 max-[768px]:py-14 max-[768px]:px-8 max-[480px]:px-6">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-[48px] max-[1024px]:text-[40px] max-[768px]:text-[30px]">Faça parte disso.</h2>
                        <p className="text-[var(--sub-text)] text-[18px] max-[1024px]:text-[16px]">Use a Vyse no seu negócio ou venha construí-la com a gente.</p>
                    </div>
                    <div className="flex flex-row max-[480px]:flex-col max-[480px]:w-full gap-4">
                        <CtaButton />
                        <Link href="/careers" className="text-center border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] py-2 px-6 rounded-full transition-normal">
                            Ver carreiras
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}