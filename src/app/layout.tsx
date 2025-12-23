import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
    description: "Usado por milhares de clientes! O sistema ERP que conecta todas as áreas da sua empresa de ponta a ponta.",
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="pt-br">
            <body>
                {children}
            </body>
        </html>
    )
}
