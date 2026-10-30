import { cn } from "@/_lib/utils"

export const fieldClass = "w-full px-3 py-2 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] outline-none bg-transparent transition-fast"

interface FormFieldProps {
    label: string
    error?: string
    className?: string
    children: React.ReactNode
}

export default function FormField({ label, error, className, children }: FormFieldProps) {
    return (
        <label className={cn("flex flex-col gap-1", className)}>
            <span className="text-[14px] text-[var(--sub-text)]">{label}</span>
            {children}
            {error && <span role="alert" className="text-[13px] text-red-400">{error}</span>}
        </label>
    )
}