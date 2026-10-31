interface ClearFiltersButtonProps {
	onClear: () => void
}

export default function ClearFiltersButton({ onClear }: ClearFiltersButtonProps) {
	return (
		<button
			onClick={onClear}
			className="px-[15px] py-[5px] border-2 border-[var(--foreground)] rounded-[15px] hover:border-[var(--middleground)] transition-normal cursor-pointer"
		>
			Limpar Filtros
		</button>
	)
}