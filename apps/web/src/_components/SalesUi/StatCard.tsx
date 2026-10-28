interface StatCardProps {
    title: string
    value: string
    description?: string
    highlight?: boolean
}

export default function StatCard({ title, value, description, highlight = false }: StatCardProps) {
    return (
        <div className="flex flex-col gap-1 bg-[var(--foreground)] p-4 rounded-[15px]">
            <h3 className="text-[var(--sub-text)] text-sm">{title}</h3>
            <p className={`text-2xl font-semibold truncate ${highlight ? "text-[var(--text-head)]" : ""}`}>{value}</p>
            {description && (
                <span className="text-[var(--sub-text)] text-sm">{description}</span>
            )}
        </div>
    )
}