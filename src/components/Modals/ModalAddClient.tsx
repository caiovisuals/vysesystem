"use client"

import { useState } from "react"
import { Client } from "@/types/clients"
import { clientTags } from "@/mocks/clients"

interface Props {
    open: boolean
    onClose: () => void
    onSave: (client: Client) => void
}

export default function ModalAddClient({ open, onClose, onSave }: Props) {
    const [form, setForm] = useState<Client>({
        id: "",
        name: "",
        phone: "",
        address: "",
        neighborhood: "",
        email: "",
        tag: "",
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name || !form.email) return

        onSave({ ...form, id: crypto.randomUUID() })
        setForm({ ...form, name: "", email: "" })
        onClose()
    }

    return (
        <div className={`fixed modal-overlay flex items-center justify-center transition-fast ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}>
            <form onSubmit={submit} className={`bg-[var(--background)] p-6 rounded-2xl space-y-3 w-full max-w-md transition-fast ${open ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold pb-1">Adicionar Cliente</h2>

                <input
                    placeholder="Nome"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[var(--foreground)] rounded-[15px] outline-none"
                />

                <input
                    placeholder="E-mail"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[var(--foreground)] rounded-[15px] outline-none"
                />

                <select
                    value={form.tag}
                    onChange={e => setForm({ ...form, tag: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[var(--foreground)] rounded-[15px] outline-none"
                >
                    <option value="">Selecione a tag</option>
                    {clientTags.map(tag => (
                        <option key={tag.value} value={tag.value} className="bg-[var(--background)]">
                            {tag.label}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={onClose} className="bg-transparent hover:bg-[var(--foreground)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[var(--text)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    )
}