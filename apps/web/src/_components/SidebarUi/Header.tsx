"use client"

import { useState } from "react"
import Avatar from "@/_components/SidebarUi/Avatar"
import { useActiveCompany } from "@/_contexts/AuthContext"

import ModalCompanySettings from "@/_components/Modals/ModalCompanySettings"

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const company = useActiveCompany()

    if (!company) return null

    return(
        <div className={`flex w-full justify-center relative`}>
            <header onClick={() => setIsModalOpen(true)} className={`flex w-full p-[12px] rounded-[15px] transition-normal cursor-pointer ${isModalOpen ? "bg-[var(--foreground)]" : "hover:bg-[var(--foreground)]"}`}>
                <div className="flex size-full flex-row items-center justify-start gap-[15px]">
                    <Avatar src={company.image} alt={company.name} />
                    <div className="flex flex-col items-start gap-[3px]">
                        <h1>{company.name}</h1>
                        <div className="flex flex-row items-center gap-[5px]">
                            <div
                                className={`size-3 rounded-full ${
                                    company.status === "open"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                            />
                            <h2 className="text-[14px]">
                                {company.status === "open"
                                    ? "Aberto"
                                    : "Fechado"}
                            </h2>
                        </div>
                    </div>
                </div>
            </header>
            <ModalCompanySettings
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {}}
            />
        </div>
    )
}