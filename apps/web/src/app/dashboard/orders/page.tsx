"use client"

import * as React from "react"
import { useState } from "react"
import {
    ColumnDef,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Sale } from "@vysesystem/types"
import { useSales, useSalesStats } from "@/_hooks/use-sales"
import { useDebouncedValue } from "@/_hooks/use-debounced-value"
import { SearchInput } from "@/_components/RegisterUi/SearchInput"
import PaginationBar from "@/_components/RegisterUi/PaginationBar"

const NO_SALES: Sale[] = []
const PAGE_SIZE = 20

export default function Orders() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE })
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebouncedValue(search.trim())

    // Busca, ordenação e paginação no servidor; os totais vêm agregados do banco
    const { data: page, isLoading, isFetching, error } = useSales({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        q: debouncedSearch,
        sortBy: sorting[0]?.id,
        order: sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined,
    })
    const { data: stats } = useSalesStats()
    const data = page?.items ?? NO_SALES
    const totalPages = page?.totalPages ?? 1

    React.useEffect(() => {
        if (pagination.pageIndex >= totalPages) setPagination(prev => ({ ...prev, pageIndex: totalPages - 1 }))
    }, [pagination.pageIndex, totalPages])

    function resetPage() {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDateTime = (date: Date) => {
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
            accessorKey: "number",
            header: "Pedido",
            cell: ({ getValue }) => `#${getValue() ?? "-"}`,
        },
        {
            accessorKey: "createdAt",
            header: "Data e Hora",
            cell: ({ getValue }) => formatDateTime(getValue() as Date),
        },
        {
            accessorKey: "customerName",
            header: "Cliente",
            cell: ({ getValue }) => getValue() || "Cliente Avulso",
        },
        {
            accessorKey: "cashierName",
            header: "Vendedor",
            cell: ({ getValue }) => getValue() || "-",
        },
        {
            accessorKey: "items",
            header: "Itens",
            enableSorting: false,
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
            cell: ({ getValue }) => formatCurrency((getValue() as number | undefined) ?? 0),
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
            pagination,
            columnVisibility,
        },
        getRowId: (sale) => sale.id,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        rowCount: page?.total ?? 0,
        enableMultiSort: false,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: (updater) => {
            setSorting(updater)
            resetPage()
        },
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
    })

    // Estatísticas de todas as vendas (vendas canceladas não entram no total)
    const totalSales = stats?.byStatus.COMPLETED.revenue ?? 0
    const completedSales = stats?.byStatus.COMPLETED.count ?? 0
    const pendingSales = stats?.byStatus.PENDING.count ?? 0

    return (
        <div className="w-full h-full flex flex-col space-y-[15px] p-[18px]">
            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-[var(--foreground)] p-4 rounded-[15px]">
                    <h3 className="text-[var(--sub-text)] text-sm">Total de Pedidos</h3>
                    <p className="text-2xl font-semibold">{stats?.count ?? 0}</p>
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
                        title="Busca por cliente, vendedor ou número do pedido"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value)
                            resetPage()
                        }}
                    />
                    <button
                        onClick={() => {
                            setSearch("")
                            setSorting([])
                            resetPage()
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
                                    {isLoading
                                        ? "Carregando pedidos"
                                        : error
                                            ? `Não foi possível carregar os pedidos: ${error.message}`
                                            : "Não há pedidos registrados."}
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
            <PaginationBar
                page={pagination.pageIndex + 1}
                totalPages={totalPages}
                onPageChange={(next) => table.setPageIndex(next - 1)}
                isFetching={isFetching && !isLoading}
                summary={`Mostrando ${data.length} de ${page?.total ?? 0} pedido(s)`}
            />
        </div>
    )
}