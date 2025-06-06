"use client"

import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
	const pathSegments = pathname.split("/").filter(Boolean)

    return (
        <div>
            <header></header>
            {children}
        </div>
    )
}