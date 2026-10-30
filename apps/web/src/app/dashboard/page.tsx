"use client"

import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import toast from "react-hot-toast"
import { Client, Employee, PaymentMethod, Product, Sale, SaleStatus } from "@vysesystem/types"
import { paymentMethods } from "@/_lib/constants"
import { formatCurrency } from "@/_lib/format"
import { toNumber } from "@/_hooks/use-entity-form"
import { useProducts } from "@/_hooks/use-products"
import { useClients } from "@/_hooks/use-clients"
import { useEmployees } from "@/_hooks/use-employees"
import { useCreateSale } from "@/_hooks/use-sales"
import { fieldClass } from "@/_components/Modals/FormField"
import ProductEntry from "@/_components/PosUi/ProductEntry"
import CartTable, { type CartItem } from "@/_components/PosUi/CartTable"
import ModalSaleSuccess from "@/_components/PosUi/ModalSaleSuccess"

const NO_PRODUCTS: Product[] = []
const NO_CLIENTS: Client[] = []
const NO_EMPLOYEES: Employee[] = []

const toCents = (value: number) => Math.round(value * 100) / 100

export default function Dashboard() {
	const { data: products = NO_PRODUCTS, isLoading: isLoadingProducts } = useProducts()
	const { data: clients = NO_CLIENTS } = useClients()
	const { data: employees = NO_EMPLOYEES } = useEmployees()
	const createSale = useCreateSale()

	const searchRef = useRef<HTMLInputElement>(null)

	const [cart, setCart] = useState<CartItem[]>([])
	const [customerId, setCustomerId] = useState("")
	const [cashierId, setCashierId] = useState("")
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MONEY")
	const [discountText, setDiscountText] = useState("")
	const [receivedText, setReceivedText] = useState("")
	const [completed, setCompleted] = useState<{ sale: Sale, change: number } | null>(null)

	const subtotal = toCents(cart.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0))
	const discount = toCents(toNumber(discountText) ?? 0)
	const total = toCents(subtotal - discount)
	const received = toNumber(receivedText)
	const change = paymentMethod === "MONEY" && received !== undefined ? toCents(received - total) : 0
	const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

	const discountError = Number.isNaN(discount) || discount < 0
		? "Desconto inválido"
		: discount > subtotal
			? "Desconto maior que o subtotal"
			: null
	const receivedError = paymentMethod === "MONEY" && received !== undefined && (Number.isNaN(received) || received < total)
		? "Valor recebido menor que o total"
		: null

	// Estoque é conferido só para vendas concluídas na API; aqui avisamos antes de lançar
	function hasStock(product: Product, quantity: number) {
		const current = products.find(p => p.id === product.id) ?? product
		if (quantity <= current.quantityInStock) return true

		toast.error(current.quantityInStock === 0
			? `${current.name} está sem estoque`
			: `Estoque insuficiente: ${current.quantityInStock} un de ${current.name} disponíveis`)
		return false
	}

	function addItem(product: Product, quantity: number) {
		const inCart = cart.find(item => item.product.id === product.id)?.quantity ?? 0
		if (!hasStock(product, inCart + quantity)) return false

		setCart(prev => inCart > 0
			? prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
			: [...prev, { product, quantity }])
		return true
	}

	function changeQuantity(productId: string, quantity: number) {
		const item = cart.find(i => i.product.id === productId)
		if (!item || quantity < 1 || !hasStock(item.product, quantity)) return
		setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
	}

	function removeItem(productId: string) {
		setCart(prev => prev.filter(item => item.product.id !== productId))
	}

	function clearSale() {
		setCart([])
		setCustomerId("")
		setPaymentMethod("MONEY")
		setDiscountText("")
		setReceivedText("")
	}

	const canSubmit = cart.length > 0 && !discountError && !receivedError && !createSale.isPending

	async function submit(status: Exclude<SaleStatus, "CANCELLED">) {
		if (!canSubmit) return

		try {
			const sale = await createSale.mutateAsync({
				items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
				discount,
				paymentMethod,
				status,
				cashierId: cashierId || undefined,
				customerId: customerId || undefined,
			})
			setCompleted({ sale, change: status === "COMPLETED" ? Math.max(change, 0) : 0 })
			// O operador continua o mesmo na próxima venda
			clearSale()
		} catch {
			// O erro já foi exibido ao usuário; o pedido continua montado para nova tentativa
		}
	}

	// Atalhos de teclado: F2 busca produto, F9 finaliza a venda
	const submitRef = useRef(submit)
	submitRef.current = submit
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "F2") {
				e.preventDefault()
				searchRef.current?.focus()
			} else if (e.key === "F9") {
				e.preventDefault()
				submitRef.current("COMPLETED")
			}
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [])

	return (
		<>
			<div className="w-full h-full p-[18px] grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)] gap-[18px] overflow-y-auto">
				{/* Lançamento de itens */}
				<div className="flex flex-col gap-[15px] min-w-0">
					<ProductEntry
						products={products}
						isLoading={isLoadingProducts}
						searchRef={searchRef}
						onAdd={addItem}
					/>
					<div className="flex flex-col gap-2 p-4 border-2 border-[var(--foreground)] rounded-[15px]">
						<div className="flex flex-row items-center justify-between">
							<h2 className="text-xl font-semibold">Pedido de Venda</h2>
							{cart.length > 0 && (
								<button type="button" onClick={clearSale} className="text-[14px] text-[var(--sub-text)] hover:text-red-400 transition-fast cursor-pointer">
									Limpar pedido
								</button>
							)}
						</div>
						<CartTable items={cart} onChangeQuantity={changeQuantity} onRemove={removeItem} />
					</div>
				</div>
				{/* Fechamento */}
				<div className="flex flex-col gap-[15px] p-4 border-2 border-[var(--foreground)] rounded-[15px] h-fit">
					<label className="flex flex-col gap-1">
						<span className="text-[14px] text-[var(--sub-text)]">Cliente</span>
						<select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={fieldClass}>
							<option value="" className="bg-[var(--background)]">Consumidor final</option>
							{clients.map(client => (
								<option key={client.id} value={client.id} className="bg-[var(--background)]">{client.name}</option>
							))}
						</select>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-[14px] text-[var(--sub-text)]">Operador de caixa</span>
						<select value={cashierId} onChange={(e) => setCashierId(e.target.value)} className={fieldClass}>
							<option value="" className="bg-[var(--background)]">Não informado</option>
							{employees.map(employee => (
								<option key={employee.id} value={employee.id} className="bg-[var(--background)]">{employee.name}</option>
							))}
						</select>
					</label>
					<div className="flex flex-col gap-1">
						<span className="text-[14px] text-[var(--sub-text)]">Forma de pagamento</span>
						<div role="radiogroup" className="grid grid-cols-2 gap-2">
							{paymentMethods.map(method => (
								<button
									key={method.value}
									type="button"
									role="radio"
									aria-checked={paymentMethod === method.value}
									onClick={() => setPaymentMethod(method.value)}
									className={clsx(
										"px-3 py-2 border-2 rounded-[15px] text-[14px] transition-normal cursor-pointer",
										paymentMethod === method.value
											? "bg-[var(--middleground)] border-[var(--middleground)]"
											: "border-[var(--foreground)] hover:border-[var(--middleground)]",
									)}
								>
									{method.label}
								</button>
							))}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<label className="flex flex-col gap-1">
							<span className="text-[14px] text-[var(--sub-text)]">Desconto (R$)</span>
							<input
								type="number"
								min={0}
								step="0.01"
								inputMode="decimal"
								placeholder="0,00"
								value={discountText}
								onChange={(e) => setDiscountText(e.target.value)}
								className={fieldClass}
							/>
							{discountError && <span role="alert" className="text-[13px] text-red-400">{discountError}</span>}
						</label>
						{paymentMethod === "MONEY" && (
							<label className="flex flex-col gap-1">
								<span className="text-[14px] text-[var(--sub-text)]">Valor recebido (R$)</span>
								<input
									type="number"
									min={0}
									step="0.01"
									inputMode="decimal"
									placeholder="0,00"
									value={receivedText}
									onChange={(e) => setReceivedText(e.target.value)}
									className={fieldClass}
								/>
								{receivedError && <span role="alert" className="text-[13px] text-red-400">{receivedError}</span>}
							</label>
						)}
					</div>
					<div className="flex flex-col gap-2 bg-[var(--foreground)] p-4 rounded-[15px]">
						<div className="flex flex-row justify-between">
							<span className="text-[var(--sub-text)]">Subtotal ({itemsCount} {itemsCount === 1 ? "item" : "itens"})</span>
							<span>{formatCurrency(subtotal)}</span>
						</div>
						<div className="flex flex-row justify-between">
							<span className="text-[var(--sub-text)]">Desconto</span>
							<span>- {formatCurrency(discountError ? 0 : discount)}</span>
						</div>
						<div className="flex flex-row justify-between text-2xl font-semibold pt-1">
							<span>Total</span>
							<span className="text-[var(--text-head)]">{formatCurrency(discountError ? subtotal : total)}</span>
						</div>
						{paymentMethod === "MONEY" && change > 0 && (
							<div className="flex flex-row justify-between text-lg">
								<span className="text-[var(--sub-text)]">Troco</span>
								<span>{formatCurrency(change)}</span>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<button
							type="button"
							disabled={!canSubmit}
							onClick={() => submit("COMPLETED")}
							className="w-full py-3 bg-[var(--text-head)] text-[var(--background)] font-semibold rounded-[15px] transition-normal enabled:hover:brightness-90 enabled:cursor-pointer disabled:opacity-40"
						>
							{createSale.isPending ? "Registrando" : "Finalizar venda"} <kbd className="text-[12px] font-normal">F9</kbd>
						</button>
						<button
							type="button"
							disabled={!canSubmit}
							onClick={() => submit("PENDING")}
							className="w-full py-2 bg-[var(--foreground)] hover:bg-[var(--middleground)] rounded-[15px] transition-normal disabled:text-[var(--sub-text)] enabled:cursor-pointer"
						>
							Salvar como pendente
						</button>
					</div>
				</div>
			</div>
			<ModalSaleSuccess
				sale={completed?.sale ?? null}
				change={completed?.change ?? 0}
				onClose={() => {
					setCompleted(null)
					searchRef.current?.focus()
				}}
			/>
		</>
	)
}