"use client"

import { useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Product } from "@vysesystem/types"
import { cn } from "@/_lib/utils"
import { formatCurrency } from "@/_lib/format"
import { fieldClass } from "@/_components/Modals/FormField"

const MAX_RESULTS = 8

interface ProductEntryProps {
    products: Product[]
    isLoading: boolean
    // Campo de busca, para a tela focar com o atalho F2
    searchRef: React.RefObject<HTMLInputElement | null>
    // Retorna false quando o item não pôde entrar no carrinho (ex.: sem estoque)
    onAdd: (product: Product, quantity: number) => boolean
}

// Busca por código ou nome, define a quantidade e lança o item no pedido
export default function ProductEntry({ products, isLoading, searchRef, onAdd }: ProductEntryProps) {
    const quantityRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState("1")
    const [isOpen, setIsOpen] = useState(false)
    const [highlighted, setHighlighted] = useState(0)

    // Código exato primeiro, depois códigos que começam com o texto e nomes que o contêm
    const matches = useMemo(() => {
        const search = query.trim().toLowerCase()
        if (!search || selected) return []

        return products
            .filter(product => String(product.code).startsWith(search) || product.name.toLowerCase().includes(search))
            .sort((a, b) => Number(String(b.code) === search) - Number(String(a.code) === search))
            .slice(0, MAX_RESULTS)
    }, [products, query, selected])

    const parsedQuantity = Number(quantity)
    const validQuantity = Number.isInteger(parsedQuantity) && parsedQuantity > 0

    function choose(product: Product) {
        setSelected(product)
        setQuery(product.name)
        setIsOpen(false)
        quantityRef.current?.select()
    }

    function add() {
        if (!selected) {
            toast.error("Selecione um produto")
            searchRef.current?.focus()
            return
        }
        if (!validQuantity) {
            toast.error("Quantidade deve ser um número inteiro maior que zero")
            quantityRef.current?.select()
            return
        }

        if (!onAdd(selected, parsedQuantity)) return

        setSelected(null)
        setQuery("")
        setQuantity("1")
        searchRef.current?.focus()
    }

    function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault()
            if (matches.length === 0) return
            setIsOpen(true)
            setHighlighted(prev => (prev + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length)
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (selected) quantityRef.current?.select()
            else if (matches[highlighted]) choose(matches[highlighted])
            else if (query.trim()) toast.error("Produto não encontrado")
        } else if (e.key === "Escape") {
            setIsOpen(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 p-4 border-2 border-[var(--foreground)] rounded-[15px]">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-3 items-end">
                <label className="relative flex flex-col gap-1">
                    <span className="text-[14px] text-[var(--sub-text)]">Produto (código ou nome) <kbd className="text-[12px]">F2</kbd></span>
                    <input
                        ref={searchRef}
                        value={query}
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={isOpen && matches.length > 0}
                        aria-controls="pos-product-list"
                        placeholder={isLoading ? "Carregando produtos" : "Ex.: 3 ou Refrigerante"}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setSelected(null)
                            setIsOpen(true)
                            setHighlighted(0)
                        }}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        onKeyDown={handleSearchKeyDown}
                        className={fieldClass}
                    />
                    {isOpen && matches.length > 0 && (
                        <ul id="pos-product-list" role="listbox" className="absolute top-full mt-2 w-full max-h-72 overflow-auto border-2 border-[var(--foreground)] rounded-[15px] bg-[var(--background)] z-10 shadow-lg">
                            {matches.map((product, index) => (
                                <li
                                    key={product.id}
                                    role="option"
                                    aria-selected={index === highlighted}
                                    // mousedown antes do blur do input, senão a lista fecha antes do clique
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        choose(product)
                                    }}
                                    onMouseEnter={() => setHighlighted(index)}
                                    className={cn(
                                        "flex flex-row items-center justify-between gap-3 px-3 py-2 cursor-pointer transition-fast",
                                        index === highlighted && "bg-[var(--foreground)]",
                                    )}
                                >
                                    <span className="truncate">
                                        <span className="text-[var(--sub-text)] mr-2">{product.code}</span>
                                        {product.name}
                                    </span>
                                    <span className="flex flex-col items-end shrink-0 text-[14px]">
                                        {formatCurrency(product.finalPrice)}
                                        <span className={product.quantityInStock === 0 ? "text-red-400" : "text-[var(--sub-text)]"}>
                                            {product.quantityInStock} em estoque
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-[14px] text-[var(--sub-text)]">Quantidade</span>
                    <input
                        ref={quantityRef}
                        type="number"
                        min={1}
                        step={1}
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                add()
                            }
                        }}
                        className={fieldClass}
                    />
                </label>
                <button
                    type="button"
                    onClick={add}
                    className="px-[15px] py-[9px] bg-[var(--foreground)] hover:bg-[var(--middleground)] rounded-[15px] transition-normal cursor-pointer"
                >
                    + Adicionar
                </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-[14px]">
                <div className="flex flex-col">
                    <span className="text-[var(--sub-text)]">Valor unitário</span>
                    <span className="text-[18px]">{selected ? formatCurrency(selected.finalPrice) : "-"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[var(--sub-text)]">Total do item</span>
                    <span className="text-[18px]">{selected && validQuantity ? formatCurrency(selected.finalPrice * parsedQuantity) : "-"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[var(--sub-text)]">Em estoque</span>
                    <span className={cn("text-[18px]", selected?.quantityInStock === 0 && "text-red-400")}>
                        {selected ? `${selected.quantityInStock} un` : "-"}
                    </span>
                </div>
            </div>
        </div>
    )
}