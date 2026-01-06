"use client"

import Link from "next/link"

export default function Footer() {    
    return (
        <Link href="/dashboard" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-2 px-6 rounded-full transition-normal">
            Integre ao seu negócio
        </Link>
    )
}