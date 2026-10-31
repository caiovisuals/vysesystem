"use client"

import * as React from "react"
import { useState } from "react"
import {
    ColumnDef,
    PaginationState,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { clientTags } from "@/_lib/constants"
import { useClients, useCreateClient, useDeleteClients, useUpdateClient } from "@/_hooks/use-clients"
import { useDebouncedValue } from "@/_hooks/use-debounced-value"
import { Client } from "@vysesystem/types"

import CheckboxInput from "@/_components/RegisterUi/CheckboxInput"
import { SearchInput } from "@/_components/RegisterUi/SearchInput"
import Combobox from "@/_components/RegisterUi/Combobox"
import AddClient from "@/_components/RegisterUi/AddClient"
import EditClient from "@/_components/RegisterUi/EditClient"
import ClearFiltersButton from "@/_components/RegisterUi/ClearFiltersButton"
import PaginationBar from "@/_components/RegisterUi/PaginationBar"

import ModalAddClient from "@/_components/Modals/ModalAddClient"
import ModalEditClient from "@/_components/Modals/ModalEditClient"

const NO_CLIENTS: Client[] = []
const PAGE_SIZE = 20
const MAX_CLIENTS = 500

export default function Clients() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE })
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const [search, setSearch] = useState("")
    const [selectedTag, setSelectedTag] = useState("")
    const debouncedSearch = useDebouncedValue(search.trim())

    // Busca, filtro, ordenação e paginação acontecem no servidor; a tela só mostra a página pedida
    const { data: page, isLoading, isFetching, error } = useClients({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        q: debouncedSearch,
        tag: selectedTag,
        sortBy: sorting[0]?.id,
        order: sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined,
    })
    const data = page?.items ?? NO_CLIENTS
    const total = page?.total ?? 0
    const createClient = useCreateClient()
    const updateClient = useUpdateClient()
    const deleteClients = useDeleteClients()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    // Mudar o filtro volta para a primeira página. A seleção vale só para a página exibida
    function resetPage() {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
        setRowSelection({})
    }

    // Se a página atual deixou de existir (ex.: depois de excluir registros), vai para a última
    const totalPages = page?.totalPages ?? 1
    React.useEffect(() => {
        if (pagination.pageIndex >= totalPages) setPagination(prev => ({ ...prev, pageIndex: totalPages - 1 }))
    }, [pagination.pageIndex, totalPages])

    const columns: ColumnDef<Client>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <CheckboxInput
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <CheckboxInput
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "tag",
            header: "Tag",
            cell: ({ getValue }) => {
                const tagValue = getValue() as string
                const tag = clientTags.find(t => t.value === tagValue)
                return tag ? tag.label : tagValue},
            },
        {
            accessorKey: "address",
            header: "Endereço",
        },
        {
            accessorKey: "neighborhood",
            header: "Bairro",
        },
        {
            accessorKey: "email",
            header: "E-mail",
        },
        {
            accessorKey: "phone",
            header: "Telefone",
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            columnVisibility,
            rowSelection,
        },
        getRowId: (client) => client.id,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        rowCount: total,
        enableMultiSort: false,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: (updater) => {
            setSorting(updater)
            resetPage()
        },
        onPaginationChange: (updater) => {
            setPagination(updater)
            setRowSelection({})
        },
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    })

    async function handleAddClient({ id: _, ...client }: Client) {
        await createClient.mutateAsync(client)
    }

    function handleEditClick() {
        const selectedRows = table.getSelectedRowModel().rows
        if (selectedRows.length !== 1) return

        setSelectedClient(selectedRows[0].original)
        setIsEditModalOpen(true)
    }

    async function handleUpdateClient({ id, ...data }: Client) {
        await updateClient.mutateAsync({ id, data })
    }

    async function handleDelete() {
        setRowSelection({})
    }

    const canAdd = total < MAX_CLIENTS

    const selectedRowsCount = table.getSelectedRowModel().rows.length
    const canEdit = selectedRowsCount === 1

    return (
        <>
            <div className="w-full h-full flex flex-col space-y-[15px] p-[18px]">
                <div className="flex flex-row flex-wrap items-center justify-between gap-[15px]">
                    <div className="flex flex-row items-center gap-[15px]">
                        <SearchInput
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value)
                                resetPage()
                            }}
                        />
                        <Combobox 
                            items={clientTags}
                            entity="tag"
                            translatedEntity="Tag"
                            value={selectedTag}
                            onValueChange={(val) => {
                                setSelectedTag(val)
                                resetPage()
                            }}
                        />
                        <ClearFiltersButton
                            onClear={() => {
                                setSearch("")
                                setSelectedTag("")
                                setSorting([])
                                resetPage()
                            }}
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <EditClient onClick={handleEditClick} disabled={!canEdit} />
                        <AddClient onClick={() => setIsAddModalOpen(true)} disabled={!canAdd} />
                    </div>
                </div>
                <div className="relative w-full overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className={`p-2 ${
                                        header.column.id === "select" ? "text-center" : "text-left"
                                    }`}>
                                        {header.isPlaceholder ? null : (
                                        <button
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`flex items-center gap-2 w-full ${
                                                header.column.id === "select"
                                                ? "justify-center"
                                                : "justify-start"
                                            }`}
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
                                            ? "Carregando clientes"
                                            : error
                                                ? `Não foi possível carregar os clientes: ${error.message}`
                                                : "Não há clientes registrados."}
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                className={`p-2 border-t-2 border-[var(--foreground)] ${
                                                    cell.column.id === "select" ? "text-center" : ""
                                                }`}
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
                <PaginationBar
                    page={pagination.pageIndex + 1}
                    totalPages={totalPages}
                    onPageChange={(next) => table.setPageIndex(next - 1)}
                    isFetching={isFetching && !isLoading}
                    summary={`${selectedRowsCount} selecionado(s) · ${total} cliente(s)`}
                />
            </div>
            <ModalAddClient
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddClient}
            />
            <ModalEditClient
                open={isEditModalOpen}
                client={selectedClient}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedClient(null)
                }}
                onSave={handleUpdateClient}
            />
        </>
    )
}