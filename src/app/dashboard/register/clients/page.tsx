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

import { clients, clientTags } from "@/mocks/clients"
import { Client } from "@/types/clients"

import CheckboxInput from "@/components/RegisterUi/CheckboxInput"
import { SearchInput } from "@/components/RegisterUi/SearchInput"
import Combobox from "@/components/RegisterUi/Combobox"
import ClearFiltersButton from "@/components/RegisterUi/ClearFiltersButton"

export default function Clients() {
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
            className="w-4 h-4"/>
        ),
        cell: ({ row }) => (
            <CheckboxInput
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4"/>
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
        data: clients,
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

    return (
        <div className="w-full h-full flex flex-col space-y-[15px] p-[18px]">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[15px]">
                    <SearchInput
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                    }/> 
                    <Combobox items={clientTags}
                    entity="tag"
                    translatedEntity="Tag"
                    value={selectedTag}
                    onValueChange={(val) => {
					    setSelectedTag(val)
					    table.getColumn("tag")?.setFilterValue(val)}}/>                
                    <ClearFiltersButton table={table} resetTag={() => setSelectedTag("")}/>
                </div>
                <div className="flex flex-row items-center gap-[15px]">
                    <button>Colunas</button>
                    <div>+ Adicionar Cliente</div>
                </div>
            </div>
            <div className="relative w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                            <th key={header.id} className="text-left p-2">
                                {header.isPlaceholder ? null : (
                                <button
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="flex items-center gap-2"
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
                                <td key={cell.id} className="p-2 border-t-2 border-[var(--foreground)]">
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
                    <h3>
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} linha(s) selecionada(s)
                    </h3>
                </div>
                <div className="flex flex-row items-center gap-[15px]">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    )
}