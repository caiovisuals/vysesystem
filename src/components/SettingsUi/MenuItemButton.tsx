export default function MenuItemButton({ onClick, label, active, }: {
    onClick: () => void
    label: string
    active: boolean
}) {
    return (
        <button onClick={onClick} className={`flex items-center justify-start hover:bg-[var(--middleground)] rounded-[15px] py-1.5 px-4 transition-all duration-300 ease-in-out cursor-pointer ${active ? "bg-[var(--foreground)]" : "bg-[var(--background)]"} `}>
            {label}
        </button>
    )
}