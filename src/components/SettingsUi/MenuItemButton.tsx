import { ReactNode } from "react"
interface MenuItemButtonProps {
    onClick: () => void
    label: string
    icon?: ReactNode
    active: boolean
}

export default function MenuItemButton({
    onClick,
    label,
    icon,
    active,
}: MenuItemButtonProps) {
    return (
        <button onClick={onClick} className={`flex items-center justify-start gap-2 hover:bg-[var(--middleground)] rounded-[15px] py-1.5 px-2.5 whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer ${active ? "bg-[var(--foreground)]" : "bg-transparent"} `}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
            </svg>
            {label}
        </button>
    )
}