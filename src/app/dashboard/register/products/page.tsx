"use client"

import { products } from "@/mocks/products"
import { ProductTableItem } from "@/types/products"
import CheckboxInput from "@/components/RegisterUi/CheckboxInput"

export default function Products() {
    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold">Produtos</h2>
			<span className="text-muted-foreground">Página não disponível</span>
		</div>
    )
}