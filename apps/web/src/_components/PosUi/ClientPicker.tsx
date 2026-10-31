"use client"

import { useState } from "react"
import { Client } from "@vysesystem/types"
import { cn } from "@/_lib/utils"
import { useClients } from "@/_hooks/use-clients"
import { useDebouncedValue } from "@/_hooks/use-debounced-value"
import { fieldClass } from "@/_components/Modals/FormField"

const MAX_RESULTS = 8

interface ClientPickerProps {
    value: Client | null
    onChange: (client: Client | null) => void
}

// Busca o cliente no servidor pelo nome, e-mail, telefone ou documento; vazio = consumidor final
export default function ClientPicker({ value, onChange }: ClientPickerProps) {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [highlighted, setHighlighted] = useState(0)

    const search = useDebouncedValue(query.trim(), 250)
    const isSearching = Boolean(search) && !value
    const { data, isFetching, isPlaceholderData } = useClients({ q: search, pageSize: MAX_RESULTS }, { enabled: isSearching })
    const isStale = !isSearching || search !== query.trim() || isPlaceholderData
    const matches = isStale ? [] : data?.items ?? []

    function choose(client: Client) {
        onChange(client)
        setQuery("")
        setIsOpen(false)
    }

    if (value) {
        return (
            <div className={cn(fieldClass, "flex flex-row items-center justify-between gap-2")}>
                <span className="truncate">{value.name}</span>
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    aria-label="Remover cliente"
                    className="text-[var(--sub-text)] hover:text-red-400 transition-fast cursor-pointer"
                >
                    ✕
                </button>
            </div>
        )
    }

    return (
        <div className="relative">
            <input
                value={query}
                autoComplete="off"
                role="combobox"
                aria-expanded={isOpen && matches.length > 0}
                aria-controls="pos-client-list"
                placeholder="Consumidor final (digite para buscar)"
                onChange={(e) => {
                    setQuery(e.target.value)
                    setIsOpen(true)
                    setHighlighted(0)
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onKeyDown={(e) => {
                    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && matches.length > 0) {
                        e.preventDefault()
                        setIsOpen(true)
                        setHighlighted(prev => (prev + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length)
                    } else if (e.key === "Enter" && matches[highlighted]) {
                        e.preventDefault()
                        choose(matches[highlighted])
                    } else if (e.key === "Escape") {
                        setIsOpen(false)
                    }
                }}
                className={cn(fieldClass, "w-full")}
            />
            {isOpen && isSearching && !isStale && !isFetching && matches.length === 0 && (
                <div className="absolute top-full mt-2 w-full px-3 py-2 border-2 border-[var(--foreground)] rounded-[15px] bg-[var(--background)] z-10 text-[var(--sub-text)]">
                    Nenhum cliente encontrado
                </div>
            )}
            {isOpen && matches.length > 0 && (
                <ul id="pos-client-list" role="listbox" className="absolute top-full mt-2 w-full max-h-72 overflow-auto border-2 border-[var(--foreground)] rounded-[15px] bg-[var(--background)] z-10 shadow-lg">
                    {matches.map((client, index) => (
                        <li
                            key={client.id}
                            role="option"
                            aria-selected={index === highlighted}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                choose(client)
                            }}
                            onMouseEnter={() => setHighlighted(index)}
                            className={cn(
                                "flex flex-col px-3 py-2 cursor-pointer transition-fast",
                                index === highlighted && "bg-[var(--foreground)]",
                            )}
                        >
                            <span className="truncate">{client.name}</span>
                            {(client.email || client.phone) && (
                                <span className="truncate text-[14px] text-[var(--sub-text)]">{client.email || client.phone}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}