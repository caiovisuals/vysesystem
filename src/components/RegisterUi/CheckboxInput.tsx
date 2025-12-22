interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function CheckboxInput(props: CheckboxInputProps) {
    return (
        <input
        type="checkbox"
        {...props}
        className={`w-4 h-4 ${props.className ?? ""}`}/>
    )
}
