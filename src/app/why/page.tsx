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
            <section className="flex flex-col px-32 py-16 gap-4 min-h-[calc(100vh-96px)]">
                <h2 className="text-[32px]">Por que devo usar a Vyse?</h2>
                <div className="flex flex-col gap-4">
                    <p className="text-[var(--sub-text)]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, aperiam perferendis assumenda tenetur, impedit inventore blanditiis deserunt voluptatibus magni ratione deleniti nulla vel quaerat iusto necessitatibus error corrupti debitis praesentium.</p>
                    <p className="text-[var(--sub-text)]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, aperiam perferendis assumenda tenetur, impedit inventore blanditiis deserunt voluptatibus magni ratione deleniti nulla vel quaerat iusto necessitatibus error corrupti debitis praesentium.</p>
                    <p className="text-[var(--sub-text)]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, aperiam perferendis assumenda tenetur, impedit inventore blanditiis deserunt voluptatibus magni ratione deleniti nulla vel quaerat iusto necessitatibus error corrupti debitis praesentium.</p>
                    <p className="text-[var(--sub-text)]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, aperiam perferendis assumenda tenetur, impedit inventore blanditiis deserunt voluptatibus magni ratione deleniti nulla vel quaerat iusto necessitatibus error corrupti debitis praesentium.</p>
                </div>
            </section>
            <Footer />
        </div>
    )
}