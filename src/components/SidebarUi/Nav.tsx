"use client"

import Link from "next/link"
import clsx from "clsx"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function Nav() {
    const pathname = usePathname()
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {}

    if (pathname.startsWith("/register/")) {
        newOpenMenus["register"] = true
    }

    setOpenMenus(newOpenMenus)
    }, [pathname])

    const toggleMenu = (key: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }
    
    const links = [
        {
            name: "Painel de Gestão",
            href: "/dashboard",
            icon: (
                <>
                    <rect width="7" height="9" x="3" y="3" rx="1"/>
                    <rect width="7" height="5" x="14" y="3" rx="1"/>
                    <rect width="7" height="9" x="14" y="12" rx="1"/>
                    <rect width="7" height="5" x="3" y="16" rx="1"/>
                </>
            )
        },
        {
            name: "Vendas", 
            href: "/dashboard/sales",
            icon: (
                <>
                    <path d="M16 7h6v6"/>
                    <path d="m22 7-8.5 8.5-5-5L2 17"/>
                </>
            )
        },
        {
            name: "Cadastro", 
            key: "register",
            icon: (
                <>
                    <rect width="13" height="7" x="8" y="3" rx="1"/>
                    <path d="m2 9 3 3-3 3"/>
                    <rect width="13" height="7" x="8" y="14" rx="1"/>
                </>
            ),
            children: [
                { 
                    name: "Produtos", 
                    href: "/dashboard/register/products",
                    icon: (
                        <>
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                            <path d="m3.3 7 8.7 5 8.7-5"/>
                            <path d="M12 22V12"/>
                        </>
                    )
                },
                { 
                    name: "Clientes", 
                    href: "/dashboard/register/clients",
                    icon: (
                        <>
                            <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/>
                            <path d="M8 15H7a4 4 0 0 0-4 4v2"/>
                            <circle cx="10" cy="7" r="4"/>
                        </>
                    )
                },
                { 
                    name: "Fornecedores", 
                    href: "/dashboard/register/suppliers",
                    icon: (
                        <>
                            <path d="M12 22v-9"/>
                            <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/>
                            <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/>
                            <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/>
                        </>
                    )
                },
                { 
                    name: "Colaboradores", 
                    href: "/dashboard/register/employees",
                    icon: (
                        <>
                            <path d="M18 21a8 8 0 0 0-16 0"/>
                            <circle cx="10" cy="8" r="5"/>
                            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
                        </>
                    )
                },
            ]
        },
        { 
            name: "Configurações",
            href: "/dashboard/settings",
            icon: (
                <>
                    <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                    <circle cx="12" cy="12" r="3"/>
                </>
            )
        },
    ]

    return (
        <div className="flex flex-col gap-[8px]">
            {links.map((link) => {
                const isCurrent = pathname === link.href
                const isSubRoute = link.children?.some(child => pathname === child.href)

                if (link.children) {
                    const isOpen = openMenus[link.key] || isSubRoute

                    return (
                        <div key={link.name}>
                            <button
                                onClick={() => toggleMenu(link.key!)}
                                className={clsx(
                                    "w-full flex items-center gap-[10px] px-[15px] py-[8px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer",
                                    isOpen ? "bg-[var(--middleground)]" : "hover:bg-[var(--foreground)]"
                                )}
                            >
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {link.icon}
                                </svg>
                                <span className="font-medium text-[18px]">
                                    {link.name}
                                </span>
                            </button>

                            {isOpen && (
                                <div className="mt-[8px] flex flex-col gap-[8px]">
                                    {link.children.map((sub) => {
                                        const isSubActive = pathname === sub.href
                                        return (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                className={clsx(
                                                    "flex flex-row items-center gap-[10px] ml-[30px] px-[15px] py-[8px] rounded-[15px] transition-all duration-300 ease-in-out",
                                                    isSubActive ? "bg-[var(--foreground)]" : "text-[var(--sub-text)] hover:text-[var(--text)]"
                                                )}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    {sub.icon}
                                                </svg>
                                                <span className="font-medium text-[18px]">
                                                    {sub.name}
                                                </span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                }

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "w-full flex items-center gap-[12px] px-[15px] py-[8px] rounded-[15px] transition-all duration-300 ease-in-out",
                            isCurrent ? "bg-[var(--middleground)]" : "hover:bg-[var(--foreground)]"
                        )}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {link.icon}
                        </svg>
                        <span className="font-medium text-[18px]">
                            {link.name}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}