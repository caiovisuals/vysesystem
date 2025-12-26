"use client"

import { useState } from "react"

import Avatar from "@/components/SidebarUi/Avatar"
import { sidebarData } from "@/mocks/sidebar"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return(
        <div className={`flex w-full justify-center relative`}>
            <header onClick={() => setIsOpen(true)} className={`flex w-full p-[12px] hover:bg-[var(--foreground)] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer`}>
                <div className="flex w-full h-full flex-row items-center justify-start gap-[15px]">
                    <Avatar></Avatar>
                    <div className="flex flex-col items-start gap-[3px]">
                        <h1>{sidebarData.teams[0].name}</h1>
                        <div className="flex flex-row items-center gap-[5px]">
                            <div className={`w-3 h-3 rounded-full ${sidebarData.teams[0].planStatus ? "bg-green-500" : "bg-red-500"}`}/>
                            <h2 className="text-[14px]">{sidebarData.teams[0].planStatus ? "Aberto" : "Fechado"}</h2>
                        </div>
                    </div>
                </div>
            </header>

            <div onClick={() => setIsOpen(false)} className={`fixed modal-overlay flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className={`bg-[var(--background)] p-[30px] rounded-[15px] transition-all duration-300 ease-in-out ${isOpen ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                    
                </div>
            </div>
        </div>
    )
}