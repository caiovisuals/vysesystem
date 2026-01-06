"use client"

import { useState } from "react"
import { Company } from "@/types/companys"
import { companys } from "@/mocks/companys"

interface Props {
    open: boolean
    onClose: () => void
    onSave: (company: Company) => void
}

export default function ModalCompanySettings({ open, onClose, onSave }: Props) {

    return (
        <div className={`fixed modal-overlay flex items-center justify-center transition-fast ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className={`bg-[var(--background)] p-[30px] rounded-[15px] transition-fast ${open ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
            </div>
        </div>
    )
}