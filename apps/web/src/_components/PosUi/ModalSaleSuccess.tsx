"use client"

import Link from "next/link"
import { Sale } from "@vysesystem/types"
import { paymentMethods } from "@/_lib/constants"
import { formatCurrency } from "@/_lib/format"

interface ModalSaleSuccessProps {
    sale: Sale | null
    // Troco calculado no caixa (só para pagamento em dinheiro)
    change: number
    onClose: () => void
}

export default function ModalSaleSuccess({ sale, change, onClose }: ModalSaleSuccessProps) {
    const open = sale !== null
    const isPending = sale?.status === "PENDING"

    return (
        <div inert={!open} className={`fixed modal-overlay flex items-center justify-center p-4 transition-fast ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}>
            <div role="dialog" aria-modal="true" className={`bg-[var(--background)] p-6 rounded-2xl space-y-4 w-full max-w-md transition-fast ${open ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                {sale && (
                    <>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-semibold">
                                {isPending ? "Pedido salvo" : "Venda concluída"}
                            </h2>
                            <span className="text-[var(--sub-text)]">
                                {isPending
                                    ? `Pedido nº ${sale.number} ficou pendente. Conclua em Pedidos quando o pagamento for confirmado.`
                                    : `Venda nº ${sale.number} registrada e estoque atualizado.`}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 bg-[var(--foreground)] p-4 rounded-[15px]">
                            <div className="flex flex-row justify-between">
                                <span className="text-[var(--sub-text)]">Itens</span>
                                <span>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                            <div className="flex flex-row justify-between">
                                <span className="text-[var(--sub-text)]">Pagamento</span>
                                <span>{paymentMethods.find(method => method.value === sale.paymentMethod)?.label}</span>
                            </div>
                            <div className="flex flex-row justify-between text-xl font-semibold">
                                <span>Total</span>
                                <span className="text-[var(--text-head)]">{formatCurrency(sale.total)}</span>
                            </div>
                            {change > 0 && (
                                <div className="flex flex-row justify-between text-xl font-semibold">
                                    <span>Troco</span>
                                    <span>{formatCurrency(change)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <Link href="/dashboard/orders" className="bg-transparent hover:bg-[var(--foreground)] px-4 py-2 rounded-[15px] transition-fast">
                                Ver pedidos
                            </Link>
                            <button type="button" autoFocus onClick={onClose} className="bg-[var(--foreground)] hover:bg-[var(--middleground)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer">
                                Nova venda
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}