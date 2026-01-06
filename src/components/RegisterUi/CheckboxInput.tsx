interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function CheckboxInput(props: CheckboxInputProps) {
    return (
        <label className="relative flex items-center justify-center cursor-pointer">
            <input
                type="checkbox"
                {...props}
                className={`
                    block mx-auto peer appearance-none rounded-full size-6 border-2 border-[var(--foreground)]
                    transition-fast cursor-pointer 

                    checked:bg-[var(--foreground)]
                    checked:border-[var(--text)]

                    hover:border-zinc-400

                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--foreground)]
                    focus:ring-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    
                    ${props.className ?? ""}
                `}
            />
            <svg
                viewBox="0 0 24 24"
                stroke="var(--text)"
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="
                    pointer-events-none absolute size-4
                    fill-none

                    scale-100
                    transition-all duration-200

                    peer-checked:opacity-100
                    peer-checked:scale-100
                "
            >
                <path d="M20 6 9 17l-5-5" />
            </svg>
        </label>
    )
}

