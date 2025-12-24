"use client"

interface IntroductionProps {
    category: string
}

export default function Introduction({ category }: IntroductionProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[var(--text-head)]">{category}</span>
            <h2 className="text-[var(--text)] text-[34px] font-medium">Comece aqui</h2>
            <span className="text-[var(--sub-text)] text-[18px]">Pegue seu café e aprenda sobre a VyseSystem!</span>
        </div>
    )
}