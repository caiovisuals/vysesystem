import "./globals.css"
import type { Metadata } from "next"
import { Geologica } from "next/font/google"
import { AuthProvider } from "@/_contexts/AuthContext"

const geologica = Geologica({
    subsets: ["latin"],
    display: "swap",
})

export const metadata: Metadata = {
    title: "VyseSystem",
    description: "Usado por milhares de clientes! O sistema ERP que conecta todas as áreas da sua empresa de ponta a ponta.",
    keywords: [
        "vysesystem",
        "pdv",
        "caiovisuals"
    ],
    openGraph: {
        type: "website",
        locale: "pt_BR",
        images: [{
            url: "https://vysesystem.com/ogimage.png",
            width: 2400,
            height: 1260,
            alt: "Preview VyseSystem",
            type: "image/png"
        }],
        countryName: "Brasil",
    },
    twitter: {
        card: "summary_large_image",
        site: "@caioba2007",
        images: ["https://vysesystem.com/ogimage.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    },
    alternates: {
        languages: {
            'pt-BR': '/'
        }
    },
    other: {
        "google": "notranslate",
        "application-name": "VTRACK",
    }
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="pt-br">
            <body className={geologica.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
