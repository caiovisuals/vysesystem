import { Table } from "@tanstack/react-table"
import { ClientTableItem } from "../../types/clients"

interface ClearFiltersButtonProps {
	table: Table<ClientTableItem>
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
			className="px-[15px] py-[5px] border-2 border-[var(--foreground)] rounded-[15px] hover:border-[var(--middleground)] transition-all duration-300 ease-in-out cursor-pointer"
		>
			Limpar Filtros
		</button>
	)
}
