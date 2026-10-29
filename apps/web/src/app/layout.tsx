import "./globals.css"
import type { Metadata } from "next"
import { Geologica } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/_contexts/AuthContext"
import { DataProvider } from "@/_contexts/DataContext"
import { QueryProvider } from "@/_contexts/QueryProvider"

const geologica = Geologica({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geologica",
})

export const metadata: Metadata = {
    title: "VyseSystem",
    description: "Usado por milhares de clientes! O sistema ERP que conecta todas as áreas da sua empresa de ponta a ponta.",
    keywords: [
        "vysesystem", "pdv", "caiovisuals"
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
            "pt-BR": "/"
        }
    },
    other: {
        "google": "notranslate",
        "application-name": "VyseSystem",
    }
}

const schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "name": "VyseSystem",
            "url": "https://vysesystem.com",
            "logo": "https://vysesystem.com/logo.png"
        },
        {
            "@type": "SoftwareApplication",
            "name": "VyseSystem ERP",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": "https://vysesystem.com",
            "description": "Sistema ERP com PDV, financeiro e gestão empresarial.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
            }
        }
    ]
}


export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="pt-BR">
            <head>
                <Script
                    id="schema-jsonld"
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            </head>
            <body className={`${geologica.className} ${geologica.variable}`}>
                <QueryProvider>
                    <AuthProvider>
                        <DataProvider>
                            {children}
                        </DataProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
