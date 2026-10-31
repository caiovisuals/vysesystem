import { Metadata } from "next"
import Header from "@/_components/LandingPageUi/Header"
import Footer from "@/_components/LandingPageUi/Footer"
import DocumentationScreen from "@/_components/DocumentationUi/DocumentationScreen"

export const metadata: Metadata = {
	title: "VyseSystem - Documentação",
    description: "Documentação completa do VyseSystem, o ERP/CRM que integra vendas, pedidos, cadastros e fiscal em um só lugar.",
}

export default function Documentation() {
    return (
        <div className="flex flex-col">
            <Header />
            <DocumentationScreen />
            <Footer />
        </div>
    )
}