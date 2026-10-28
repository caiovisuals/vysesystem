"use client"

type AddClientProps = {
    onClick: () => void
    disabled: boolean
}

export default function AddClient({ onClick, disabled }: AddClientProps) {
    return (
        <button onClick={onClick} disabled={disabled} className="px-[15px] py-[5px] bg-[var(--foreground)] hover:bg-[var(--middleground)] rounded-[15px] transition-normal disabled:text-[var(--sub-text)] disabled:cursor-default enabled:cursor-pointer">
            + Adicionar Cliente
        </button>
    )
}