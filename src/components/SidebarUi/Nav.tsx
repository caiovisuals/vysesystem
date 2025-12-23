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
        { icon:"/sidebaricons/dashboard.png", name: "Painel de Gestão", href: "/dashboard" },
        { icon:"/sidebaricons/sales.png", name: "Vendas", href: "/dashboard/sales" },
        {
            icon: "/sidebaricons/register.png", name: "Cadastro", key: "register", children: [
                { icon: "/sidebaricons/sub/products.png", name: "Produtos", href: "/dashboard/register/products" },
                { icon: "/sidebaricons/sub/clients.png", name: "Clientes", href: "/dashboard/register/clients" },
                { icon: "/sidebaricons/sub/employees.png", name: "Colaboradores", href: "/dashboard/register/employees" },
            ]
        },
        { icon:"/sidebaricons/settings.png", name: "Configurações", href: "/dashboard/settings" },
    ]

    return (
        <div className="flex flex-col gap-[5px]">
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
                                    "w-full flex items-center gap-[10px] px-[15px] py-[8px] rounded-[15px] transition-all duration-300 ease-in-out",
                                    isOpen ? "bg-[var(--middleground)]" : "hover:bg-[var(--foreground)]"
                                )}
                            >
                                <img src={link.icon} className="w-[20px]" />
                                <span className="font-medium text-left">{link.name}</span>
                            </button>

                            {isOpen && (
                                <div className="mt-[5px] flex flex-col gap-[5px]">
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
                                                <img src={sub.icon} className="w-[20px]" />
                                                {sub.name}
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
                            "flex items-center gap-[12px] px-[15px] py-[8px] rounded-lg transition-all duration-300 ease-in-out",
                            isCurrent ? "bg-[var(--middleground)]" : "hover:bg-[var(--foreground)]"
                        )}
                    >
                        <img src={link.icon} className="w-[22px]" />
                        <span className="font-medium">{link.name}</span>
                    </Link>
                )
            })}
        </div>
    )
}