import type { PaymentMethod, WorkShift } from "@vysesystem/types"

export const PASSWORD_MIN_LENGTH = 8

export const clientTags: { label: string; value: string }[] = [
    { label: "Frequente", value: "frequent" },
    { label: "Inativo", value: "inactive" },
    { label: "Novo", value: "new" },
]

export const workShifts: { label: string; value: WorkShift }[] = [
    { label: "Manhã", value: "morning" },
    { label: "Tarde", value: "afternoon" },
    { label: "Noite", value: "night" },
    { label: "Integral", value: "full" },
]

export const paymentMethods: { label: string; value: PaymentMethod }[] = [
    { label: "Dinheiro", value: "MONEY" },
    { label: "PIX", value: "PIX" },
    { label: "Cartão de Crédito", value: "CREDIT_CARD" },
    { label: "Cartão de Débito", value: "DEBIT_CARD" },
    { label: "Carteira Digital", value: "DIGITAL_WALLETS" },
]