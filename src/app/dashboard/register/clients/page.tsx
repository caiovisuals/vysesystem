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

import { clients as initialClients, clientTags } from "@/mocks/clients"
import { Client } from "@/types/clients"

import CheckboxInput from "@/components/RegisterUi/CheckboxInput"
import { SearchInput } from "@/components/RegisterUi/SearchInput"
import Combobox from "@/components/RegisterUi/Combobox"
import AddClient from "@/components/RegisterUi/AddClient"
import EditClient from "@/components/RegisterUi/EditClient"
import ClearFiltersButton from "@/components/RegisterUi/ClearFiltersButton"

import ModalAddClient from "@/components/Modals/ModalAddClient"
import ModalEditClient from "@/components/Modals/ModalEditClient"

export default function Clients() {
    const [data, setData] = useState<Client[]>(initialClients)

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [selectedTag, setSelectedTag] = useState("")

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

    function handleAddClient(client: Client) {
        setData(prev => [...prev, client])
    }

    function handleEditClick() {
        const selectedRows = table.getSelectedRowModel().rows
        if (selectedRows.length !== 1) return

        setSelectedClient(selectedRows[0].original)
        setIsEditModalOpen(true)
    }

    function handleUpdateClient(updatedClient: Client) {
        setData(prev =>
            prev.map(client =>
                client.id === updatedClient.id ? updatedClient : client
            )
        )
    }

    const canAdd = data.length < 500

    const selectedRowsCount = table.getSelectedRowModel().rows.length
    const canEdit = selectedRowsCount === 1

    return (
        <>
            <div className="w-full h-full flex flex-col space-y-[15px] p-[18px]">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-[15px]">
                        <SearchInput
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                        /> 
                        <Combobox 
                            items={clientTags}
                            entity="tag"
                            translatedEntity="Tag"
                            value={selectedTag}
                            onValueChange={(val) => {
                                setSelectedTag(val)
                                table.getColumn("tag")?.setFilterValue(val)
                            }}
                        />                
                        <ClearFiltersButton 
                            table={table} 
                            resetTag={() => setSelectedTag("")}
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
                                        Não há clientes registrados.
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
                
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                        <span>
                            {table.getFilteredSelectedRowModel().rows.length} de{" "}
                            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s)
                        </span>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-5 py-2 bg-[var(--foreground)] hover:bg-[var(--middleground)] disabled:text-[var(--sub-text)] rounded-[15px] transition-all duration-150 disabled:cursor-normal enabled:cursor-pointer">
                            Anterior
                        </button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-5 py-2 bg-[var(--foreground)] hover:bg-[var(--middleground)] disabled:text-[var(--sub-text)] rounded-[15px] transition-all duration-150 disabled:cursor-normal enabled:cursor-pointer">
                            Próxima
                        </button>
                    </div>
                </div>
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