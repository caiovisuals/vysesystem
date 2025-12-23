interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function CheckboxInput(props: CheckboxInputProps) {
    return (
        <input
        type="checkbox"
        {...props}
        className={`size-4 ${props.className ?? ""}`}/>
    )
}
