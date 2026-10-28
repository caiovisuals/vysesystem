import { cn } from "@/_lib/utils"
import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const SearchInput = React.forwardRef<HTMLInputElement,React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
    return (
        <div className="relative flex flex-row items-center gap-[15px]">
            <img src="/search.png" alt="" className="absolute left-3 w-[18px]" />
            <input placeholder="Pesquisar clientes..." className={cn("px-[20px] py-[5px] pl-[35px] rounded-[15px] border-2 border-[var(--foreground)] hover:border-[var(--middleground)] transition-normal outline-none", className)} type={type} ref={ref} {...props}></input>
        </div>
    )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }
