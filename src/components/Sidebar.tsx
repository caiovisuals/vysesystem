"use client"

import * as React from "react"
import Link from "next/link"
import clsx from "clsx"
import Avatar from "./Avatar"
import { usePathname } from "next/navigation"
import { sidebarData } from "@/mocks/sidebar"

export function Sidebar({ ...props }) {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    const links = [
        { icon:"/sidebaricons/dashboard.png", name: "Dashboard", href: "/" },
        { icon:"/sidebaricons/sales.png", name: "Vendas", href: "/sales" },
        { icon:"/sidebaricons/register.png", name: "Cadastro", href: "/register" },
        { icon:"/sidebaricons/settings.png", name: "Configurações", href: "/settings" },
    ]

    return (
        <div className="h-full flex flex-col justify-between p-[15px] gap-[30px]" {...props}>
            <div className="flex flex-col gap-[30px]">
                <header className="flex items-center gap-[15px] justify-between">
                    <div className="flex items-center gap-[15px]">
                        <Avatar></Avatar>
                        <div className="flex flex-col items-start justify-centers">
                            <h1>{sidebarData.teams[0].name}</h1>
                            <h2>{sidebarData.teams[0].plan}</h2>
                        </div>
                    </div>
                    <img src="/arrow.png" className="w-[15px]"></img>
                </header>
                <div className="flex flex-col gap-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link key={link.name} href={link.href} className={clsx("flex items-center gap-[12px] px-4 py-2 rounded-lg transition-all duration-300 ease-in-out", isActive
                                        ? "bg-[var(--middleground)]"
                                        : " hover:bg-[var(--foreground)]")}>
                                <img src={link.icon} className="w-[22px]"></img>
                                <span className={clsx("font-medium",)}>
                                    {link.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="flex items-center justify-between gap-[15px]">
                <Avatar></Avatar>
                <div className="flex flex-col items-start justify-centers">
                    <h1>{sidebarData.user.name}</h1>
                    <h2>{sidebarData.user.email}</h2>
                </div>
            </div>
        </div>
    )
}
