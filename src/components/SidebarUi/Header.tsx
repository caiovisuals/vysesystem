"use client"

import { useState, useEffect, useRef } from "react"

import Avatar from "@/components/SidebarUi/Avatar"
import { sidebarData } from "@/mocks/sidebar"

export default function Header() {
    const [open, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const toggleDropdown = () => setIsOpen(prev => !prev)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return(
        <div ref={dropdownRef} className={`flex w-full justify-center relative`}>
            <header onClick={toggleDropdown} className={`flex w-full p-[12px] hover:bg-[var(--foreground)] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer ${open ? `bg-[var(--foreground)]` : `bg-transparent`}`}>
                <div className="flex w-full h-full flex-row items-center gap-[15px] justify-between">
                    <div className="flex flex-row items-center gap-[10px] justify-start">
                        <Avatar></Avatar>
                        <div className="flex flex-col items-start gap-[3px]">
                            <h1>{sidebarData.teams[0].name}</h1>
                            <div className="flex flex-row items-center gap-[5px]">
                                <div className={`w-3 h-3 rounded-full ${sidebarData.teams[0].planStatus ? "bg-green-500" : "bg-red-500"}`}></div>
                                <h2 className="text-[14px]">{sidebarData.teams[0].planStatus ? "Aberto" : "Fechado"}</h2>
                            </div>
                        </div>
                    </div>
                    <img src="/arrow.png" className={`w-[18px] transition-all duration-300 ease-in-out ${open ? `rotate-180` : `rotate-0` }`}></img>
                </div>
            </header>

            <div className={`absolute w-full rounded-[15px] bg-[var(--foreground)] p-[10px] mt-[70px] transition-all duration-300 ease-in-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                Header
            </div>
        </div>
    )
}