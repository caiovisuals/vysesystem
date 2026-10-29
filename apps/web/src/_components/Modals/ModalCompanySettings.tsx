"use client"

import { useState } from "react"
import Avatar from "@/_components/SidebarUi/Avatar"
import { users } from "@/_mocks/user"
import { User, Company } from "@vysesystem/types"

interface Props {
    open: boolean
    onClose: () => void
    onSave: (company: Company) => void
}

export default function ModalCompanySettings({ open, onClose, onSave }: Props) {
    const [user, setUser] = useState<User>(users[0])

    const company = user.companies.find(
        c => c.id === user.activeCompanyId
    )

    if (!company) return null

    return (
        <div className={`fixed modal-overlay flex items-center justify-center transition-fast ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className={`bg-[var(--background)] p-[30px] rounded-[15px] transition-fast ${open ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-row items-center justify-start gap-[15px]">
                    <Avatar src={company.image} alt={company.name} />
                    <div className="flex flex-col items-start gap-[3px]">
                        <h2>{company.name}</h2>
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
            </div>
        </div>
    )
}