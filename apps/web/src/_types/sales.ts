export type Sale = {
    id: string
    subtotal: number
    discount?: number
    total: number
    paymentMethod: PaymentMethod
    cashierId: string
    cashierName?: string
    customerId?: string
    customerName?: string
    items: SaleItem[]
    status: SaleStatus
    createdAt: Date
}

export type SaleItem = {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
}

export type SaleStatus = 
    | "PENDING"
    | "COMPLETED"
    | "CANCELLED"

export type PaymentMethod =
    | "MONEY"
    | "PIX"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "DIGITAL_WALLETS"