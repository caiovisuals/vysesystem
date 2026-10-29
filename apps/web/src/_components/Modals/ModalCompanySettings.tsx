"use client"

import { useEffect, useState } from "react"
import { Company } from "@vysesystem/types"
import Avatar from "@/_components/SidebarUi/Avatar"
import { useActiveCompany } from "@/_contexts/AuthContext"
import { useUpdateActiveCompany } from "@/_hooks/use-company"
import type { CompanyInput } from "@/_lib/schemas"

interface Props {
    open: boolean
    onClose: () => void
}

type CompanyForm = Required<Omit<CompanyInput, "status">> & { status: Company["status"] }

function toForm(company: Company): CompanyForm {
    return {
        name: company.name,
        cnpj: company.cnpj,
        address: company.address,
        phone: company.phone,
        status: company.status,
    }
}

const inputClass = "w-full px-3 py-2 border-2 border-[var(--foreground)] rounded-[15px] outline-none"

export default function ModalCompanySettings({ open, onClose }: Props) {
    const company = useActiveCompany()
    const updateCompany = useUpdateActiveCompany()
    const [form, setForm] = useState<CompanyForm | null>(() => company && toForm(company))

    // Reinicia o formulário a partir do banco sempre que o modal abre, descartando edições não salvas
    useEffect(() => {
        if (open && company) setForm(toForm(company))
    }, [open, company])

    if (!company || !form) return null

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (updateCompany.isPending || !form?.name.trim()) return

        try {
            await updateCompany.mutateAsync(form)
            onClose()
        } catch {
            // O erro já foi exibido ao usuário; o modal continua aberto para nova tentativa
        }
    }

    return (
        <div className={`fixed modal-overlay flex items-center justify-center transition-fast ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}>
            <form onSubmit={submit} className={`bg-[var(--background)] p-[30px] rounded-[15px] space-y-3 w-full max-w-md transition-fast ${open ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-row items-center justify-start gap-[15px] pb-1">
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
                <input
                    placeholder="Nome"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                />
                <input
                    placeholder="CNPJ"
                    value={form.cnpj}
                    onChange={e => setForm({ ...form, cnpj: e.target.value })}
                    className={inputClass}
                />
                <input
                    placeholder="Telefone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                />
                <input
                    placeholder="Endereço"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className={inputClass}
                />
                <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as Company["status"] })}
                    className={inputClass}
                >
                    <option value="open" className="bg-[var(--background)]">Aberto</option>
                    <option value="closed" className="bg-[var(--background)]">Fechado</option>
                </select>
                <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={onClose} className="bg-transparent hover:bg-[var(--foreground)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer">
                        Cancelar
                    </button>
                    <button type="submit" disabled={updateCompany.isPending} className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[var(--text)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer">
                        {updateCompany.isPending ? "Salvando" : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    )
}