"use client"

type AddClientProps = {
    onClick: () => void
    disabled: boolean
}

export default function AddClient({ onClick, disabled }: AddClientProps) {
    return (
        <button onClick={onClick} className="px-[15px] py-[5px] bg-[var(--foreground)] hover:bg-[var(--middleground)] rounded-[15px] transition-normal disabled:cursor-normal enabled:cursor-pointer">
            + Adicionar Cliente
        </button>
    )
}