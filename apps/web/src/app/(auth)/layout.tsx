import Header from "@/_components/AuthUi/Header"
import Footer from "@/_components/AuthUi/Footer"
import { Toaster } from "react-hot-toast"

export default function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="flex flex-col w-full h-screen">
            <Toaster />
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}