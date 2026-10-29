interface ModuleCardProps {
    icon: React.ReactNode
    tag: string
    title: string
    description: string
    items: string[]
}

export default function ModuleCard({ icon, tag, title, description, items }: ModuleCardProps) {
    return (
        <div className="flex flex-col gap-5 p-8 max-[480px]:p-6 bg-[var(--second-background)] border-2 border-[var(--foreground)] hover:border-[var(--middleground)] rounded-[24px] transition-normal">
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="size-12 flex items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--text-head)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {icon}
                    </svg>
                </div>
                <span className="text-[14px] text-[var(--sub-text)] py-1 px-3 border-2 border-[var(--foreground)] rounded-full">{tag}</span>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-[24px]">{title}</h3>
                <p className="text-[var(--sub-text)]">{description}</p>
            </div>
            <ul className="flex flex-col gap-2 mt-auto">
                {items.map((item) => (
                    <li key={item} className="flex flex-row gap-3 items-start">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-head)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}