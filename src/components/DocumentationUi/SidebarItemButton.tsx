import { ReactNode } from "react"

type SidebarItemButtonProps = {
    onClick: () => void
    label: string
    icon: ReactNode
    active: boolean
}

export default function SidebarItemButton({
    onClick,
    label,
    icon,
    active,
}: SidebarItemButtonProps) {
    return (
        <button onClick={onClick} className={`flex items-center justify-start gap-3 hover:bg-[var(--middleground)] rounded-[15px] py-2 px-4 transition-all duration-300 ease-in-out cursor-pointer outline-none ${active ? "bg-[var(--foreground)] text-[var(--text)]" : "text-[var(--sub-text)] bg-[var(--third-background)]"} `}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
            </svg>
            {label}
        </button>
    )
}