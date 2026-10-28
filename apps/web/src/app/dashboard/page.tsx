"use client"

import { useState } from "react"
import { Product, Client } from "@vysesystem/types"
import toaster from "react-hot-toast"

type SaleItem = {
	product: Product
	quantity: number
	total: number
}

type PaymentMethod = "MONEY" | "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "DIGITAL_WALLETS"

export default function Dashboard() {
	const [items, setItems] = useState<SaleItem[]>([])
	const [quantity, setQuantity] = useState(1)
	const [discount, setDiscount] = useState(0)
	const [searchQty, setSearchQty] = useState("1")
	const [clientSearch, setClientSearch] = useState("")
	const [selectedClient, setSelectedClient] = useState<Client | null>(null)
	const [clientDropdown, setClientDropdown] = useState(false)
	const [isPaymentOpen, setIsPaymentOpen] = useState(false)
	const [isSuccessOpen, setIsSuccessOpen] = useState(false)
	const [saleCounter, setSaleCounter] = useState(1001)

	const mockProduct: Product = {
		id: "1",
		name: "Coca-Cola 2L",
		finalPrice: 10,
		unitCost: 6,
		quantityInStock: 50,
		weight: 2,
		createdAt: new Date(),
	}

	function addProduct() {
		const total = mockProduct.finalPrice * quantity

		setItems((prev) => [
		...prev,
		{ product: mockProduct, quantity, total },
		])

		setQuantity(1)
	}

	const subtotal = items.reduce((acc, item) => acc + item.total, 0)
 	const total = subtotal - discount

    return (
        <div className="w-full h-full p-4 flex flex-row gap-8">
			<div className="w-[60%]">
				<div className="flex flex-row gap-2">
					<label className="flex flex-col">
						<span>Codigo do Produto</span>
						<input
							type="number"
						/>
					</label>
					<label className="flex flex-col">
						<span>Quantidade</span>
						<input
							type="number"
						/>
					</label>
					<label className="flex flex-col">
						<span>Valor Unitário</span>
						<p></p>
					</label>
					<label className="flex flex-col">	
						<span>Total do Item</span>
						<p></p>
					</label>
				</div>
				<div className="flex flex-row gap-2">
					<label className="flex flex-col">
						<h3>Desconto</h3>
						<span></span>
					</label>
					<label className="flex flex-col">
						<h3>Acréscimo</h3>
						<span></span>
					</label>
					<label className="flex flex-col">
						<h3>Total da Venda</h3>
						<span></span>
					</label>
				</div>
			</div>
			<div className="w-[40%]">
				<h2>Pedido de Venda</h2>
				<table>
					<thead>
						<tr>
							<th className="text-left">Produto</th>
							<th>Qtd</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item, index) => (
							<tr key={index} className="border-t border-zinc-800">
								<td>{item.product.name}</td>
								<td className="text-center">{item.quantity}</td>
								<td className="text-right">
								R$ {item.total.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
    )
}