import { Product } from "@vysesystem/types"

export const products: Product[] = [
    {
        id: "1",
        name: "Chocolate Amargo 70%",
        finalPrice: 12.5,
        unitCost: 6.2,
        quantityInStock: 120,
        weight: 0.1,
        createdAt: new Date("2025-01-01T00:00:00"),
    },
    {
        id: "2",
        name: "Pão Francês (10un)",
        finalPrice: 4.0,
        unitCost: 1.5,
        quantityInStock: 50,
        weight: 0.8,
        createdAt: new Date("2025-01-01T00:00:00"),
    },
    {
        id: "3",
        name: "Refrigerante 2L",
        finalPrice: 8.9,
        unitCost: 3.5,
        quantityInStock: 200,
        weight: 2.0,
        createdAt: new Date("2025-01-01T00:00:00"),
    },
]
