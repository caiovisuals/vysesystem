import { Metadata } from "next"

export const metadata: Metadata = {
	title: "VyseSystem - Política de Privacidade",
    description: "Política de privacidade do VyseSystem, o ERP/CRM que integra vendas, pedidos, cadastros e fiscal em um só lugar.",
}

export default function Privacy() {
    return (
        <div className="flex-1 flex-col">
            <section id="privacy-hero"></section>
        </div>
    )
}