import { z } from "zod"
import { PASSWORD_MIN_LENGTH } from "@/_lib/constants"
import { toCents } from "@/_lib/format"

// Schemas de validação do corpo das rotas de API

// Nome de usuário normalizado: "Caio" e "caio" são a mesma conta
const username = (message: string) => z.string().trim().toLowerCase().min(1, message)

export const loginSchema = z.object({
    username: username("Usuário e senha são obrigatórios"),
    password: z.string().min(1, "Usuário e senha são obrigatórios"),
})

// E-mail normalizado: comparações de login/cadastro não dependem de maiúsculas
const email = z.string().trim().toLowerCase().pipe(z.email("E-mail inválido"))

const newPassword = z.string().min(PASSWORD_MIN_LENGTH, `Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`)

export const registerSchema = z.object({
    name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
    username: z.string().trim().toLowerCase().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
    email,
    password: newPassword,
})

export const forgotPasswordSchema = z.object({
    username: username("Usuário e e-mail são obrigatórios"),
    email,
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Link de recuperação inválido"),
    newPassword,
})

// Campos opcionais sem default: o PATCH reaproveita o schema com .partial() sem sobrescrever o que não foi enviado
export const clientSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    email,
    phone: z.string().trim().optional(),
    cpf: z.string().trim().optional(),
    cnpj: z.string().trim().optional(),
    address: z.string().trim().optional(),
    neighborhood: z.string().trim().optional(),
    tag: z.string().trim().optional(),
})

// Mesmo padrão do clientSchema: o PATCH usa .partial() e só altera o que foi enviado
export const companySchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    // Guardado só com os dígitos; vazio é permitido para empresas sem CNPJ cadastrado
    cnpj: z.string().transform(v => v.replace(/\D/g, "")).refine(v => v.length === 0 || v.length === 14, "CNPJ deve ter 14 dígitos").optional(),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    status: z.enum(["open", "closed"]).optional(),
})

// Mesmo padrão: sem defaults, para o PATCH com .partial() só alterar o que foi enviado
export const productSchema = z.object({
    // Opcional na criação: sem código, a API usa o próximo número livre da empresa
    code: z.number("Código inválido").int("Código deve ser um número inteiro").positive("Código deve ser maior que zero").optional(),
    name: z.string().trim().min(1, "Nome é obrigatório"),
    finalPrice: z.number("Preço de venda inválido").min(0, "Preço de venda não pode ser negativo").transform(toCents),
    unitCost: z.number("Custo unitário inválido").min(0, "Custo unitário não pode ser negativo").transform(toCents),
    quantityInStock: z.number("Estoque inválido").int("Estoque deve ser um número inteiro").min(0, "Estoque não pode ser negativo").optional(),
    weight: z.number("Peso inválido").min(0, "Peso não pode ser negativo").optional(),
})

export const employeeSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    email,
    phone: z.string().trim().optional(),
    salary: z.number("Salário inválido").min(0, "Salário não pode ser negativo"),
    role: z.string().trim().min(1, "Cargo é obrigatório"),
    // Aceita "2025-01-31" (input date) ou ISO completo
    hireDate: z.coerce.date("Data de admissão inválida"),
    // null remove o turno no PATCH
    workShift: z.enum(["morning", "afternoon", "night", "full"]).nullable().optional(),
})

// Campos opcionais vazios viram null no banco
const optionalText = z.string().trim().transform(v => v || null).optional()

export const supplierSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    cnpj: z.string().transform(v => v.replace(/\D/g, "")).refine(v => v.length === 0 || v.length === 14, "CNPJ deve ter 14 dígitos").transform(v => v || null).optional(),
    email: z.string().trim().toLowerCase().pipe(z.union([z.literal(""), z.email("E-mail inválido")])).transform(v => v || null).optional(),
    phone: optionalText,
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
export type CompanyInput = z.input<typeof companySchema>
export type CreateSaleInput = z.input<typeof createSaleSchema>
export type ProductInput = z.input<typeof productSchema>
export type EmployeeInput = z.input<typeof employeeSchema>
export type SupplierInput = z.input<typeof supplierSchema>