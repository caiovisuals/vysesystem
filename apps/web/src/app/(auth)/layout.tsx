import Header from "@/_components/AuthUi/Header"
import Footer from "@/_components/AuthUi/Footer"

export default function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="flex flex-col w-full h-screen">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}