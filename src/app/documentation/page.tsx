import { Metadata } from "next"
import Header from "@/components/LandingPageUi/Header"
import Footer from "@/components/LandingPageUi/Footer"
import DocumentationScreen from "@/components/DocumentationUi/DocumentationScreen"

export const metadata: Metadata = {
	title: "VyseSystem - Documentação",
}

export default function Documentation() {
    return (
        <div className="flex flex-col bg-[linear-gradient(#0F0E0F,#161116)]">
            <Header />
            <DocumentationScreen />
            <Footer />
        </div>
    )
}