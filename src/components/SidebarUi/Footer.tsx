"use client"

import { useState, useEffect, useRef } from "react"
import Avatar from "@/components/SidebarUi/Avatar"
import { users } from "@/mocks/user"

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const toggleDropdown = () => setIsOpen(prev => !prev)

    const user = users[0]

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
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-[15px] justify-start">
                        <Avatar src={user.image} />
                        <div className="flex flex-col items-start justify-center">
                            <h2 className="text-[16px]">{user.name}</h2>
                            <span className="text-[14px]">{user.email}</span>
                        </div>
                    </div>
                    <img src="/arrow.png" className={`w-[18px] mr-[5px] transition-all duration-300 ease-in-out ${isOpen ? `rotate-180` : `rotate-0` }`}></img>
                </div>
            </div>

            <div className={`absolute w-full rounded-[15px] bg-[var(--foreground)] mt-[-58px] p-[12px] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                Footer
            </div>
        </div>
    )
}
