"use client"

import Link from "next/link"

export default function WhyButton() {    
    return (
        <Link href="/why" className="text-center bg-[var(--foreground)] hover:bg-[var(--middleground)] py-2 px-6 rounded-full transition-normal">
            Por que usar?
        </Link>
    )
}