import Header from "@/_components/LandingPageUi/Header"
import Footer from "@/_components/LandingPageUi/Footer"

export default function UsefulLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex-1 min-h-[100vh]">
                {children}
            </div>  
            <Footer />
        </div>
    )
}