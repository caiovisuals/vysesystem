import { Metadata } from "next"

export const metadata: Metadata = {
	title: "VyseSystem - Termos de Uso",
}


export default function Terms() {
    return (
        <div className="flex-1 flex-col">
            <section id="terms-hero">
                <h1>Termos de Uso</h1>
                <div></div>
            </section>
            <section id="terms-faq">
                <h2>Perguntas Frequentes</h2>
                <div></div>
            </section>
        </div>
    )
}