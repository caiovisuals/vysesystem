export default function MenuItemButton({ onClick, label, active, }: {
    onClick: () => void
    label: string
    active: boolean
}) {
    return (
        <button onClick={onClick} className={`hover:bg-[var(--middleground)] rounded-[15px] py-[6px] transition-all duration-300 ease-in-out cursor-pointer ${active ? "bg-[var(--foreground)]" : "bg-[var(--second-background)]"} `}>{label}</button>
    )
}