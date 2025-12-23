import { Metadata } from "next"
import Header from "@/components/LandingPageUi/Header"
import Footer from "@/components/LandingPageUi/Footer"

export const metadata: Metadata = {
	title: "VyseSystem - Por que usar?",
}

export default function Why() {
    return (
        <div className="flex flex-col">
            <Header />
            <section className="flex flex-col px-64 gap-16 min-h-[calc(100vh-96px)] items-center justify-center">
                <h2 className="text-[32px]">Por que devo usar a Vyse?</h2>
            </section>
            <Footer />
        </div>
    )
}