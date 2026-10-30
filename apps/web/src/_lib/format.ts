const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function formatCurrency(value: number) {
    return currencyFormatter.format(value)
}

// Datas sem horário (ex.: admissão) ficam à meia-noite UTC; formatar em UTC evita mostrar o dia anterior no Brasil
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" })

export function formatDate(date: Date) {
    return dateFormatter.format(date)
}

// Valor para <input type="date">: "2025-01-31"
export function toDateInputValue(date: Date) {
    return date.toISOString().slice(0, 10)
}

export function formatCnpj(cnpj: string) {
    const digits = cnpj.replace(/\D/g, "")
    if (digits.length !== 14) return cnpj
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}