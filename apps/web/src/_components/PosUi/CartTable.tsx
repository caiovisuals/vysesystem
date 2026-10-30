"use client"

import { Product } from "@vysesystem/types"
import { formatCurrency } from "@/_lib/format"

export type CartItem = {
    product: Product
    quantity: number
}

interface CartTableProps {
    items: CartItem[]
    onChangeQuantity: (productId: string, quantity: number) => void
    onRemove: (productId: string) => void
}

const stepButtonClass = "size-7 flex items-center justify-center rounded-full bg-[var(--foreground)] hover:bg-[var(--middleground)] disabled:text-[var(--sub-text)] transition-fast enabled:cursor-pointer"

// Itens do pedido em andamento, com ajuste de quantidade e remoção
export default function CartTable({ items, onChangeQuantity, onRemove }: CartTableProps) {
    return (
        <div className="relative w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">Produto</th>
                        <th className="p-2 text-center">Qtd</th>
                        <th className="p-2 text-right whitespace-nowrap">Valor un.</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2"><span className="sr-only">Remover</span></th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-[var(--sub-text)]">
                                Nenhum item no pedido. Busque um produto pelo código ou nome para começar.
                            </td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <tr key={item.product.id}>
                                <td className="p-2 border-t-2 border-[var(--foreground)] text-[var(--sub-text)]">{index + 1}</td>
                                <td className="p-2 border-t-2 border-[var(--foreground)]">
                                    <span className="text-[var(--sub-text)] mr-2">{item.product.code}</span>
                                    {item.product.name}
                                </td>
                                <td className="p-2 border-t-2 border-[var(--foreground)]">
                                    <div className="flex flex-row items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            aria-label={`Diminuir quantidade de ${item.product.name}`}
                                            disabled={item.quantity <= 1}
                                            onClick={() => onChangeQuantity(item.product.id, item.quantity - 1)}
                                            className={stepButtonClass}
                                        >
                                            -
                                        </button>
                                        <span className="min-w-6 text-center">{item.quantity}</span>
                                        <button
                                            type="button"
                                            aria-label={`Aumentar quantidade de ${item.product.name}`}
                                            onClick={() => onChangeQuantity(item.product.id, item.quantity + 1)}
                                            className={stepButtonClass}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="p-2 border-t-2 border-[var(--foreground)] text-right whitespace-nowrap">{formatCurrency(item.product.finalPrice)}</td>
                                <td className="p-2 border-t-2 border-[var(--foreground)] text-right whitespace-nowrap">{formatCurrency(item.product.finalPrice * item.quantity)}</td>
                                <td className="p-2 border-t-2 border-[var(--foreground)] text-right">
                                    <button
                                        type="button"
                                        title="Remover item"
                                        aria-label={`Remover ${item.product.name}`}
                                        onClick={() => onRemove(item.product.id)}
                                        className="p-1 rounded-full hover:bg-[var(--foreground)] transition-fast cursor-pointer"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}