import { useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PaymentMethod, Product, PublicUser } from "@vysesystem/types"
import { createSale, getProducts, logout } from "@vysesystem/api-client"
import { toCents } from "@vysesystem/schemas"
import { formatCurrency } from "@/format"
import { meQueryKey, productsQueryKey } from "@/queries"

type CartItem = { product: Product, quantity: number }

const paymentMethods: { label: string, value: PaymentMethod }[] = [
    { label: "Dinheiro", value: "MONEY" },
    { label: "PIX", value: "PIX" },
    { label: "Cartão de Crédito", value: "CREDIT_CARD" },
    { label: "Cartão de Débito", value: "DEBIT_CARD" },
    { label: "Carteira Digital", value: "DIGITAL_WALLETS" },
]

const fieldClass = "rounded-lg border border-middleground bg-background px-3 py-2.5 outline-none focus:border-text-head"

export default function Checkout({ user }: { user: PublicUser }) {
    const queryClient = useQueryClient()
    const searchRef = useRef<HTMLInputElement>(null)

    const [search, setSearch] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MONEY")
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

    const { data: products = [], isLoading } = useQuery({ queryKey: productsQueryKey, queryFn: getProducts })

    const company = user.companies.find(c => c.id === user.activeCompanyId)
    const total = toCents(cart.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0))

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return products
        return products.filter(p => String(p.code) === term || p.name.toLowerCase().includes(term))
    }, [products, search])

    function addItem(product: Product) {
        const inCart = cart.find(item => item.product.id === product.id)?.quantity ?? 0
        if (inCart + 1 > product.quantityInStock) {
            setMessage({ type: "error", text: `Estoque insuficiente de ${product.name}` })
            return
        }
        setMessage(null)
        setCart(prev => inCart > 0
            ? prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...prev, { product, quantity: 1 }])
        setSearch("")
        searchRef.current?.focus()
    }

    // O leitor de código de barras digita o código e envia Enter, como um teclado
    function handleSearchKey(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key !== "Enter") return
        const term = search.trim()
        const product = products.find(p => String(p.code) === term) ?? (filtered.length === 1 ? filtered[0] : undefined)
        if (product) addItem(product)
    }

    const finishSale = useMutation({
        mutationFn: () => createSale({
            items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
            paymentMethod,
        }),
        onSuccess: sale => {
            setCart([])
            setMessage({ type: "success", text: `Venda ${sale.number ? `#${sale.number} ` : ""}concluída: ${formatCurrency(sale.total)}` })
            queryClient.invalidateQueries({ queryKey: productsQueryKey })
            searchRef.current?.focus()
        },
        onError: error => setMessage({ type: "error", text: error.message }),
    })

    const signOut = useMutation({
        mutationFn: logout,
        onSettled: () => {
            queryClient.removeQueries({ queryKey: productsQueryKey })
            queryClient.resetQueries({ queryKey: meQueryKey })
        },
    })

    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b border-foreground px-6 py-3">
                <div className="flex flex-col">
                    <span className="text-lg text-text-head">{company?.name ?? "VyseSystem"}</span>
                    <span className="text-xs text-sub-text">Caixa de {user.name} · v{window.vyse.versions.app}</span>
                </div>
                <button onClick={() => signOut.mutate()} className="rounded-lg border border-middleground px-4 py-2 text-sm hover:bg-second-background">
                    Sair
                </button>
            </header>
            <main className="grid min-h-0 flex-1 grid-cols-[1fr_400px] gap-6 p-6">
                <section className="flex min-h-0 flex-col gap-4">
                    <input
                        ref={searchRef}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleSearchKey}
                        autoFocus
                        placeholder="Código ou nome do produto (Enter adiciona)"
                        className={fieldClass}
                    />
                    <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-foreground">
                        {isLoading ? (
                            <p className="p-4 text-sub-text">Carregando produtos...</p>
                        ) : filtered.length === 0 ? (
                            <p className="p-4 text-sub-text">Nenhum produto encontrado.</p>
                        ) : (
                            <ul>
                                {filtered.map(product => (
                                    <li key={product.id}>
                                        <button
                                            onClick={() => addItem(product)}
                                            className="flex w-full items-center justify-between border-b border-foreground px-4 py-3 text-left hover:bg-second-background"
                                        >
                                            <span>
                                                <span className="mr-3 text-sub-text">#{product.code}</span>
                                                {product.name}
                                            </span>
                                            <span className="flex gap-6">
                                                <span className="text-sm text-sub-text">{product.quantityInStock} un</span>
                                                <span>{formatCurrency(product.finalPrice)}</span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
                <aside className="flex min-h-0 flex-col gap-4 rounded-xl border border-foreground bg-second-background p-5">
                    <h2 className="text-xl">Venda atual</h2>
                    <ul className="min-h-0 flex-1 overflow-y-auto">
                        {cart.map(item => (
                            <li key={item.product.id} className="flex items-center justify-between border-b border-foreground py-2">
                                <span>{item.quantity}x {item.product.name}</span>
                                <span className="flex items-center gap-3">
                                    {formatCurrency(item.product.finalPrice * item.quantity)}
                                    <button
                                        onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))}
                                        aria-label={`Remover ${item.product.name}`}
                                        className="text-sub-text hover:text-red-400"
                                    >
                                        ✕
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className={fieldClass}>
                        {paymentMethods.map(method => <option key={method.value} value={method.value}>{method.label}</option>)}
                    </select>
                    <div className="flex items-center justify-between text-2xl">
                        <span>Total</span>
                        <span className="text-text-head">{formatCurrency(total)}</span>
                    </div>
                    {message && (
                        <span role="status" className={message.type === "error" ? "text-sm text-red-400" : "text-sm text-green-400"}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={() => finishSale.mutate()}
                        disabled={cart.length === 0 || finishSale.isPending}
                        className="rounded-lg bg-text-head py-3 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {finishSale.isPending ? "Finalizando..." : "Finalizar venda"}
                    </button>
                </aside>
            </main>
        </div>
    )
}