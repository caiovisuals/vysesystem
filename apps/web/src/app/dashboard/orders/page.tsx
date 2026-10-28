"use client"

import * as React from "react"
import { useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { sales as initialSales } from "@/_mocks/sales"
import { Sale } from "@vysesystem/types"
import { SearchInput } from "@/_components/RegisterUi/SearchInput"

export default function Orders() {
    const [data, setData] = useState<Sale[]>(initialSales)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    const getPaymentMethodLabel = (method: string) => {
        const labels: { [key: string]: string } = {
            MONEY: "Dinheiro",
            PIX: "PIX",
            CREDIT_CARD: "Cartão de Crédito",
            DEBIT_CARD: "Cartão de Débito",
            DIGITAL_WALLETS: "Carteira Digital"
        }
        return labels[method] || method
    }

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            PENDING: "Pendente",
            COMPLETED: "Concluído",
            CANCELLED: "Cancelado"
        }
        return labels[status] || status
    }

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            PENDING: "text-yellow-500",
            COMPLETED: "text-green-500",
            CANCELLED: "text-red-500"
        }
        return colors[status] || ""
    }

    const columns: ColumnDef<Sale>[] = [
        {
            accessorKey: "id",
            header: "Pedido",
            cell: ({ getValue }) => `#${getValue()}`,
        },
        {
            accessorKey: "createdAt",
            header: "Data e Hora",
            cell: ({ getValue }) => formatDateTime(getValue() as string),
        },
        {
            accessorKey: "customerName",
            header: "Cliente",
            cell: ({ getValue }) => getValue() || "Cliente Avulso",
        },
        {
            accessorKey: "cashierName",
            header: "Vendedor",
        },
        {
            accessorKey: "items",
            header: "Itens",
            cell: ({ getValue }) => {
                const items = getValue() as Sale['items']
                return items.length
            },
        },
        {
            accessorKey: "subtotal",
            header: "Subtotal",
            cell: ({ getValue }) => formatCurrency(getValue() as number),
        },
        {
            accessorKey: "discount",
            header: "Desconto",
            cell: ({ getValue }) => formatCurrency(getValue() as number),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ getValue }) => formatCurrency(getValue() as number),
        },
        {
            accessorKey: "paymentMethod",
            header: "Pagamento",
            cell: ({ getValue }) => getPaymentMethodLabel(getValue() as string),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue() as string
                return (
                    <span className={getStatusColor(status)}>
                        {getStatusLabel(status)}
                    </span>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    })

    // Cálculos de estatísticas
    const totalSales = data.reduce((acc, sale) => acc + sale.total, 0)
    const completedSales = data.filter(sale => sale.status === "COMPLETED").length
    const pendingSales = data.filter(sale => sale.status === "PENDING").length

    return (
        <div className="w-full h-full flex flex-col space-y-[15px] p-[18px]">
            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-[var(--foreground)] p-4 rounded-[15px]">
                    <h3 className="text-[var(--sub-text)] text-sm">Total de Pedidos</h3>
                    <p className="text-2xl font-semibold">{data.length}</p>
                </div>
                <div className="bg-[var(--foreground)] p-4 rounded-[15px]">
                    <h3 className="text-[var(--sub-text)] text-sm">Pedidos Concluídos</h3>
                    <p className="text-2xl font-semibold text-green-500">{completedSales}</p>
                </div>
                <div className="bg-[var(--foreground)] p-4 rounded-[15px]">
                    <h3 className="text-[var(--sub-text)] text-sm">Pedidos Pendentes</h3>
                    <p className="text-2xl font-semibold text-yellow-500">{pendingSales}</p>
                </div>
                <div className="bg-[var(--foreground)] p-4 rounded-[15px]">
                    <h3 className="text-[var(--sub-text)] text-sm">Total em Vendas</h3>
                    <p className="text-2xl font-semibold">{formatCurrency(totalSales)}</p>
                </div>
            </div>
            {/* Filtros */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[15px]">
                    <SearchInput
                        placeholder="Pesquisar pedidos..."
                        value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("customerName")?.setFilterValue(event.target.value)
                        }
                    />
                    <button
                        onClick={() => {
                            table.resetSorting()
                            table.resetColumnFilters()
                        }}
                        className="px-[15px] py-[5px] border-2 border-[var(--foreground)] rounded-[15px] hover:border-[var(--middleground)] transition-normal cursor-pointer"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>
            {/* Tabela */}
            <div className="relative w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="p-2 text-left">
                                        {header.isPlaceholder ? null : (
                                            <button
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="flex items-center gap-2 w-full justify-start"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: "↑",
                                                    desc: "↓",
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </button>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4 text-muted-foreground">
                                    Não há pedidos registrados.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-[var(--foreground)] transition-normal">
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="p-2 border-t-2 border-[var(--foreground)]"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Paginação */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <span>
                        Mostrando {table.getRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} pedido(s)
                    </span>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <button 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()} 
                        className="px-5 py-2 bg-[var(--foreground)] hover:bg-[var(--middleground)] disabled:text-[var(--sub-text)] rounded-[15px] transition-all duration-150 disabled:cursor-default enabled:cursor-pointer"
                    >
                        Anterior
                    </button>
                    <button 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()} 
                        className="px-5 py-2 bg-[var(--foreground)] hover:bg-[var(--middleground)] disabled:text-[var(--sub-text)] rounded-[15px] transition-all duration-150 disabled:cursor-default enabled:cursor-pointer"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    )
}