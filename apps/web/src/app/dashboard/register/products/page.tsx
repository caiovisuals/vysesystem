"use client"

import { useState } from "react"
import {
    ColumnDef,
    FilterFn,
    RowSelectionState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Product } from "@vysesystem/types"
import type { ProductInput } from "@/_lib/schemas"
import { useCreateProduct, useDeleteProducts, useProducts, useUpdateProduct } from "@/_hooks/use-products"

const NO_PRODUCTS: Product[] = []

const LOW_STOCK = 15

const matchesProduct: FilterFn<Product> = (row, _columnId, query: string) => {
    const search = query.trim().toLowerCase()
    return row.original.name.toLowerCase().includes(search) || String(row.original.code).startsWith(search)
}

const columns: ColumnDef<Product>[] = [ ]

export default function Products() {
    const { data = NO_PRODUCTS, isLoading, error } = useProducts()
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()
    const deleteProducts = useDeleteProducts()

    const [editing, setEditing] = useState<Product | null | undefined>(undefined)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, rowSelection },
        getRowId: (product) => product.id,
        globalFilterFn: matchesProduct,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
    })

    const selected = table.getSelectedRowModel().rows.map(row => row.original)
    
    async function handleSave(input: ProductInput) {
        if (editing) await updateProduct.mutateAsync({ id: editing.id, data: input })
        else await createProduct.mutateAsync(input)
    }
    
    async function handleDelete() {
        try {
            await deleteProducts.mutateAsync(selected.map(product => product.id))
        } catch {
            // O erro já foi exibido ao usuário
        }
        setIsDeleteOpen(false)
    }

    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold">Produtos</h2>
			<span className="text-muted-foreground">Página não disponível</span>
		</div>
    )
}