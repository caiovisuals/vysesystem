"use client"

import { useEffect, useState } from "react"
import { Client } from "@vysesystem/types"
import { clientTags } from "@/_mocks/clients"

interface Props {
    open: boolean
    client: Client | null
    onClose: () => void
    onSave: (client: Client) => void | Promise<void>
}

export default function ModalEditClient({ open, client, onClose, onSave }: Props) {
    const [form, setForm] = useState<Client>({
        id: "",
        name: "",
        phone: "",
        address: "",
        neighborhood: "",
        email: "",
        tag: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (client) setForm(client)
    }, [client])

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (isSubmitting || !form.name || !form.email) return

        setIsSubmitting(true)
        
        try {
            await onSave(form)
            onClose()
        } catch {
            // O erro já foi exibido ao usuário; o modal continua aberto para nova tentativa
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`fixed modal-overlay flex items-center justify-center transition-fast ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}>
            <form onSubmit={submit} className={`bg-[var(--background)] p-6 rounded-2xl space-y-3 w-full max-w-md transition-fast ${open ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold pb-1">Editar Cliente</h2>
                <input
                    placeholder="Nome"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-[15px] outline-none"
                />
                <input
                    placeholder="E-mail"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-[15px] outline-none"
                />
                <select
                    value={form.tag}
                    onChange={e => setForm({ ...form, tag: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-[15px] outline-none"
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
                    <button type="submit" disabled={isSubmitting} className="bg-[var(--foreground)] hover:bg-[var(--middleground)] text-[var(--text)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer">
                        {isSubmitting ? "Salvando" : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    )
}