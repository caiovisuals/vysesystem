import { Sale } from "@vysesystem/types"

export const sales: Sale[] = [
    {
        id: "1",
        subtotal: 150.00,
        discount: 10.00,
        total: 140.00,
        paymentMethod: "PIX",
        cashierId: "1",
        cashierName: "Fulano de tal",
        customerId: "1",
        items: [
            {
                productId: "1",
                productName: "Chocolate Amargo 70%",
                quantity: 5,
                unitPrice: 12.50,
                total: 62.50
            },
            {
                productId: "2",
                productName: "Pão Francês (10un)",
                quantity: 10,
                unitPrice: 4.00,
                total: 40.00
            },
            {
                productId: "3",
                productName: "Refrigerante 2L",
                quantity: 5,
                unitPrice: 8.90,
                total: 44.50
            }
        ],
        status: "COMPLETED",
        createdAt: new Date("2025-02-06T10:30:00")
    },
    {
        id: "2",
        subtotal: 89.00,
        discount: 0,
        total: 89.00,
        paymentMethod: "CREDIT_CARD",
        cashierId: "2",
        cashierName: "Marcos Silva",
        customerId: "2",
        items: [
            {
                productId: "1",
                productName: "Chocolate Amargo 70%",
                quantity: 3,
                unitPrice: 12.50,
                total: 37.50
            },
            {
                productId: "3",
                productName: "Refrigerante 2L",
                quantity: 5,
                unitPrice: 8.90,
                total: 44.50
            },
            {
                productId: "2",
                productName: "Pão Francês (10un)",
                quantity: 2,
                unitPrice: 4.00,
                total: 8.00
            }
        ],
        status: "COMPLETED",
        createdAt: new Date("2025-02-06T11:15:00")
    },
    {
        id: "3",
        subtotal: 45.60,
        discount: 5.60,
        total: 40.00,
        paymentMethod: "MONEY",
        cashierId: "3",
        cashierName: "cleiton Costa",
        customerId: "3",
        items: [
            {
                productId: "2",
                productName: "Pão Francês (10un)",
                quantity: 4,
                unitPrice: 4.00,
                total: 16.00
            },
            {
                productId: "1",
                productName: "Chocolate Amargo 70%",
                quantity: 2,
                unitPrice: 12.50,
                total: 25.00
            }
        ],
        status: "COMPLETED",
        createdAt: new Date("2025-02-06T12:45:00")
    },
    {
        id: "4",
        subtotal: 267.00,
        discount: 0,
        total: 267.00,
        paymentMethod: "DEBIT_CARD",
        cashierId: "1",
        items: [
            {
                productId: "3",
                productName: "Refrigerante 2L",
                quantity: 30,
                unitPrice: 8.90,
                total: 267.00
            }
        ],
        status: "COMPLETED",
        createdAt: new Date("2025-02-06T12:45:00")
    },
    {
        id: "5",
        subtotal: 120.00,
        discount: 20.00,
        total: 100.00,
        paymentMethod: "PIX",
        cashierId: "2",
        cashierName: "Marcos Silva",
        customerId: "1",
        items: [
            {
                productId: "2",
                productName: "Pão Francês (10un)",
                quantity: 30,
                unitPrice: 4.00,
                total: 120.00
            }
        ],
        status: "COMPLETED",
        createdAt: new Date("2025-02-06T14:20:00")
    },
    {
        id: "6",
        subtotal: 62.50,
        discount: 0,
        total: 62.50,
        paymentMethod: "DIGITAL_WALLETS",
        cashierId: "3",
        items: [
            {
                productId: "1",
                productName: "Chocolate Amargo 70%",
                quantity: 5,
                unitPrice: 12.50,
                total: 62.50
            }
        ],
        status: "PENDING",
        createdAt: new Date("2025-02-06T16:30:00")
    }
]