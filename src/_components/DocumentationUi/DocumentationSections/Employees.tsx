"use client"

interface EmployeesProps {
    category: string
}

export default function Employees({ category }: EmployeesProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[var(--text-head)]">{category}</span>
            <h2 className="text-[var(--text)] text-[34px] font-medium">Colaboradores</h2>
            <span className="text-[var(--sub-text)] text-[18px]">Como criar sua conta e começar já deixar tudo pronto para assumir suas vendas!</span>
        </div>
    )
}