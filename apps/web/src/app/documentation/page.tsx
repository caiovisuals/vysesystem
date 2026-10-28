import { Metadata } from "next"
import Header from "@/_components/LandingPageUi/Header"
import Footer from "@/_components/LandingPageUi/Footer"
import DocumentationScreen from "@/_components/DocumentationUi/DocumentationScreen"

export const metadata: Metadata = {
	title: "VyseSystem - Documentação",
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