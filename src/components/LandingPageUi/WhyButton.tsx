"use client"

import Link from "next/link"

export default function WhyButton() {    
    return (
        <Link href="/why" className="bg-[var(--foreground)] hover:bg-[var(--middleground)] py-2 px-6 rounded-full transition-all duration-300 ease-in-out">
            Por que usar?
        </Link>
    )
}