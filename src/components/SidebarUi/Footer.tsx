"use client"

import { useState, useEffect, useRef } from "react"

import Avatar from "@/components/SidebarUi/Avatar"
import { sidebarData } from "@/mocks/sidebar"

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false)
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
            <div onClick={toggleDropdown} className={`flex w-full justify-start p-[12px] relative hover:bg-[var(--foreground)] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer ${isOpen ? `bg-[var(--foreground)]` : `bg-transparent`}`}>
                <div className="flex flex-row items-center justify-start gap-[10px]">
                    <Avatar></Avatar>
                    <div className="flex flex-col items-start gap-[3px]">
                        <h1>{sidebarData.user.name}</h1>
                        <h2>{sidebarData.user.email}</h2>
                    </div>
                </div>
            </div>

            <div className={`absolute w-full rounded-[15px] bg-[var(--foreground)] mt-[-50px] p-[10px] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                Footer
            </div>
        </div>
    )
}
