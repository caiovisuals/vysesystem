import { z } from "zod"

// Schemas de validação do corpo das rotas de API

// Campos opcionais sem default: o PATCH reaproveita o schema com .partial() sem sobrescrever o que não foi enviado
export const clientSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    email: z.email("E-mail inválido"),
    phone: z.string().trim().optional(),
    cpf: z.string().trim().optional(),
    cnpj: z.string().trim().optional(),
    address: z.string().trim().optional(),
    neighborhood: z.string().trim().optional(),
    tag: z.string().trim().optional(),
})

export const createSaleSchema = z.object({
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
    })).min(1, "A venda precisa de pelo menos um item"),
    discount: z.number().min(0, "Desconto não pode ser negativo").default(0),
    paymentMethod: z.enum(["MONEY", "PIX", "CREDIT_CARD", "DEBIT_CARD", "DIGITAL_WALLETS"]),
    status: z.enum(["PENDING", "COMPLETED"]).default("COMPLETED"),
    cashierId: z.string().optional(),
    customerId: z.string().optional(),
})

export const updateSaleStatusSchema = z.object({
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
})

export type ClientInput = z.input<typeof clientSchema>
export type CreateSaleInput = z.input<typeof createSaleSchema>