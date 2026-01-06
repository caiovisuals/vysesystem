import { Table } from "@tanstack/react-table"
import { Client } from "../../types/clients"

interface ClearFiltersButtonProps {
	table: Table<Client>
	resetTag: () => void
}

export default function ClearFiltersButton({ table, resetTag }: ClearFiltersButtonProps) {
	function clearAllFilters() {
		table.resetSorting()
		table.resetColumnFilters()
		table.getColumn("tag")?.setFilterValue(undefined)
		resetTag()
	}

	return (
		<button
			onClick={clearAllFilters}
			className="px-[15px] py-[5px] border-2 border-[var(--foreground)] rounded-[15px] hover:border-[var(--middleground)] transition-normal cursor-pointer"
		>
			Limpar Filtros
		</button>
	)
}
