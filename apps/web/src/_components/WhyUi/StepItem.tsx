interface StepItemProps {
    step: number
    title: string
    description: string
}

export default function StepItem({ step, title, description }: StepItemProps) {
    return (
        <div className="flex flex-row gap-5">
            <span className="size-11 shrink-0 flex items-center justify-center rounded-full border-2 border-[var(--middleground)] text-[var(--text-head)] text-[18px]">
                {step}
            </span>
            <div className="flex flex-col gap-2 pt-2">
                <h3 className="text-[20px]">{title}</h3>
                <p className="text-[var(--sub-text)]">{description}</p>
            </div>
        </div>
    )
}