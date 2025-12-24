export type Sale = {
    id: string
    subtotal: number
    discount?: number
    total: number
    paymentMethod: PaymentMethod
    cashierId: string
    customerId?: string
    createdAt: Date
}

export type PaymentMethod =
  | "MONEY"
  | "PIX"
  | "CREDIT_CARD"
  | "DEBIT_CARD"