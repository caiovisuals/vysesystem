"use client"

type EditClientProps = {
    onClick: () => void
    disabled: boolean
}

export default function EditClient({ onClick, disabled }: EditClientProps) {
    return (
        <button onClick={onClick} disabled={disabled} className="px-[15px] py-[5px] bg-[var(--foreground)] hover:bg-[var(--middleground)] rounded-[15px] disabled:text-[var(--sub-text)] transition-normal disabled:cursor-normal enabled:cursor-pointer">
            Editar Clientes
        </button>
    )
}