"use client"

interface SecurityRequirementsProps {
    category: string
}

export default function SecurityRequirements({ category }: SecurityRequirementsProps) {
    return (
        <div className="flex flex-col gap-2"> 
            <span className="text-[var(--text-head)]">{category}</span>
            <h2 className="text-[var(--text)] text-[34px] font-medium">Requisitos de segurança</h2>
        </div>
    )
}