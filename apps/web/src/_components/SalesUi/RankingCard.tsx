import { RankingEntry } from "@/_hooks/use-sales-report"

interface RankingCardProps {
    title: string
    entries: RankingEntry[]
    formatValue: (value: number) => string
    formatCount: (count: number) => string
    emptyMessage: string
}

export default function RankingCard({ title, entries, formatValue, formatCount, emptyMessage }: RankingCardProps) {
    const maxValue = entries[0]?.value ?? 0

    return (
        <div className="flex flex-col gap-4 p-4 border-2 border-[var(--foreground)] rounded-[15px]">
            <h3 className="text-[18px] font-medium">{title}</h3>
            {entries.length === 0 ? (
                <span className="text-[var(--sub-text)] py-4 text-center">{emptyMessage}</span>
            ) : (
                <ol className="flex flex-col gap-3">
                    {entries.map((entry, index) => (
                        <li key={entry.id} className="flex flex-col gap-1">
                            <div className="flex flex-row items-center justify-between gap-3">
                                <div className="flex flex-row items-center gap-2 min-w-0">
                                    <span className="text-[var(--sub-text)] w-5 shrink-0">{index + 1}º</span>
                                    <span className="truncate">{entry.name}</span>
                                </div>
                                <span className="font-medium shrink-0">{formatValue(entry.value)}</span>
                            </div>
                            <div className="flex flex-row items-center gap-3 pl-7">
                                <div className="flex-1 h-[6px] bg-[var(--foreground)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--text-head)] rounded-full"
                                        style={{ width: `${maxValue > 0 ? (entry.value / maxValue) * 100 : 0}%` }}
                                    />
                                </div>
                                <span className="text-[var(--sub-text)] text-sm shrink-0">{formatCount(entry.count)}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}