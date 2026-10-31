const buttonClass = "px-5 py-2 bg-[var(--foreground)] hover:bg-[var(--middleground)] disabled:text-[var(--sub-text)] rounded-[15px] transition-fast disabled:cursor-default enabled:cursor-pointer"

interface PaginationBarProps {
    // Página atual, começando em 1
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    // Texto à esquerda (ex.: linhas selecionadas ou total de registros)
    summary?: React.ReactNode
    isFetching?: boolean
}

// Navegação entre as páginas de uma lista paginada no servidor
export default function PaginationBar({ page, totalPages, onPageChange, summary, isFetching }: PaginationBarProps) {
    return (
        <div className="flex flex-row flex-wrap items-center justify-between gap-3">
            <span>{summary}</span>
            <div className="flex flex-row items-center gap-3">
                <span className="text-[var(--sub-text)]" aria-live="polite">
                    {isFetching ? "Carregando..." : `Página ${page} de ${totalPages}`}
                </span>
                <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={buttonClass}>
                    Anterior
                </button>
                <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={buttonClass}>
                    Próxima
                </button>
            </div>
        </div>
    )
}