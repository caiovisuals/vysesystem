import { Metadata } from "next"
import Header from "@/components/LandingPageUi/Header"
import Footer from "@/components/LandingPageUi/Footer"

import IntegrateButton from "@/components/LandingPageUi/IntegrateButton"
import WhyButton from "@/components/LandingPageUi/WhyButton"

export const metadata: Metadata = {
	title: "VyseSystem - Sistema PDV de ERP para comércios.",
}

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            <Header />
            <section id="hero" className="flex flex-row max-[1408px]:flex-col px-64 gap-16 min-h-[calc(100vh-96px)]">
                <div className="w-[50%] flex flex-col gap-16 justify-center mb-[100px]">
                    <div className="flex flex-col gap-8">
                        <div className="w-fit py-2 px-3 flex flex-row gap-3 border-2 border-[var(--middleground)] rounded-full items-center">
                            <div className="flex flex-row">
                                <img src="/landingpage/profile1.jpg" alt="user-profile" className="size-[25px] rounded-full object-cover aspect-square border-2 border-[var(--background)]"/>
                                <img src="/landingpage/profile2.jpg" alt="user-profile" className="size-[25px] rounded-full object-cover aspect-square border-2 border-[var(--background)] -ml-2"/>
                                <img src="/landingpage/profile3.jpg" alt="user-profile" className="size-[25px] rounded-full object-cover aspect-square border-2 border-[var(--background)] -ml-2"/>
                            </div>
                            <span className="whitespace-nowrap text-[14px] pr-1">Escolhido por +1000 empresário</span>
                        </div>
                        <h1 className="text-[68px]">
                            Controle fácil.<br className="max-[1408px]:hidden"/> 
                            Cresça rápido.
                        </h1>
                        <h3 className="text-[18px] text-[var(--sub-text)] max-w-[520px]">O sistema ERP que conecta todas as áreas da sua empresa de ponta a ponta.</h3>
                    </div>
                    <div className="flex flex-row gap-4">
                        <IntegrateButton />
                        <WhyButton />
                    </div>
                </div>
                <div className="w-[50%] mb-[100px]"></div>
            </section>
            <Footer />
        </div>
    )
}