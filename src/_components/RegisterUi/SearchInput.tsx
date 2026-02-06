import * as React from "react"


export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement,React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
    return (
        <div className="relative flex flex-row items-center gap-[15px]">
            <img src="/search.png" className="absolute left-3 w-[18px]"></img>
            <input placeholder="Pesquisar clientes..." className="px-[20px] py-[5px] pl-[35px] rounded-[15px] border-2 border-[var(--foreground)] hover:border-[var(--middleground)] transition-normal outline-none" type={type} ref={ref} {...props}></input>
        </div>
    )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }
