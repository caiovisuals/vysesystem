import { describe, expect, it } from "vitest"
import { toCents } from "@/_lib/format"
import {
    clientSchema,
    createSaleSchema,
    forgotPasswordSchema,
    loginSchema,
    productSchema,
    registerSchema,
    resetPasswordSchema,
    supplierSchema,
} from "@/_lib/schemas"

const validRegister = { name: "Caio Oliveira", username: "caio", email: "caio@exemplo.com", password: "12345678" }

describe("toCents", () => {
    it("arredonda para 2 casas sem sobras de ponto flutuante", () => {
        expect(toCents(0.1 + 0.2)).toBe(0.3)
        expect(toCents(10.005)).toBe(10.01)
        expect(toCents(3 * 19.99)).toBe(59.97)
    })
})

describe("registerSchema", () => {
    it("normaliza username e e-mail (trim + minúsculas)", () => {
        const data = registerSchema.parse({ ...validRegister, username: "  Caio ", email: " Caio@Exemplo.COM " })
        expect(data.username).toBe("caio")
        expect(data.email).toBe("caio@exemplo.com")
    })

    it("exige senha com pelo menos 8 caracteres", () => {
        expect(registerSchema.safeParse({ ...validRegister, password: "1234567" }).success).toBe(false)
        expect(registerSchema.safeParse({ ...validRegister, password: "12345678" }).success).toBe(true)
    })

    it("exige username com pelo menos 3 caracteres depois do trim", () => {
        expect(registerSchema.safeParse({ ...validRegister, username: "  ab  " }).success).toBe(false)
    })
})

describe("loginSchema", () => {
    it("normaliza o username", () => {
        expect(loginSchema.parse({ username: " CAIO ", password: "x" }).username).toBe("caio")
    })
})

describe("recuperação de senha", () => {
    it("forgotPasswordSchema só pede usuário e e-mail, normalizados", () => {
        expect(forgotPasswordSchema.parse({ username: "Caio", email: "CAIO@exemplo.com" }))
            .toEqual({ username: "caio", email: "caio@exemplo.com" })
    })

    it("o antigo passo 'reset' sem token não passa mais na validação", () => {
        const result = resetPasswordSchema.safeParse({ step: "reset", username: "caio", email: "caio@exemplo.com", newPassword: "12345678" })
        expect(result.success).toBe(false)
    })

    it("resetPasswordSchema exige token e senha com 8 caracteres", () => {
        expect(resetPasswordSchema.safeParse({ token: "abc", newPassword: "1234567" }).success).toBe(false)
        expect(resetPasswordSchema.safeParse({ token: "", newPassword: "12345678" }).success).toBe(false)
        expect(resetPasswordSchema.safeParse({ token: "abc", newPassword: "12345678" }).success).toBe(true)
    })
})

describe("clientSchema", () => {
    it("normaliza o e-mail como os outros schemas", () => {
        expect(clientSchema.parse({ name: "Ana", email: " Ana@Exemplo.com " }).email).toBe("ana@exemplo.com")
    })

    it("partial() não preenche campos não enviados", () => {
        expect(clientSchema.partial().parse({ name: "Ana" })).toEqual({ name: "Ana" })
    })
})

describe("productSchema", () => {
    it("arredonda preços para centavos", () => {
        const data = productSchema.parse({ name: "Café", finalPrice: 10.555, unitCost: 4.001 })
        expect(data.finalPrice).toBe(10.56)
        expect(data.unitCost).toBe(4)
    })

    it("recusa valores negativos e código não inteiro", () => {
        expect(productSchema.safeParse({ name: "Café", finalPrice: -1, unitCost: 1 }).success).toBe(false)
        expect(productSchema.safeParse({ name: "Café", finalPrice: 1, unitCost: 1, code: 1.5 }).success).toBe(false)
        expect(productSchema.safeParse({ name: "Café", finalPrice: 1, unitCost: 1, quantityInStock: -1 }).success).toBe(false)
    })
})

describe("supplierSchema", () => {
    it("guarda só os dígitos do CNPJ e transforma vazios em null", () => {
        expect(supplierSchema.parse({ name: "Fornecedor", cnpj: "12.345.678/0001-90", email: "", phone: "  " }))
            .toEqual({ name: "Fornecedor", cnpj: "12345678000190", email: null, phone: null })
    })

    it("recusa CNPJ com quantidade errada de dígitos", () => {
        expect(supplierSchema.safeParse({ name: "Fornecedor", cnpj: "123" }).success).toBe(false)
    })
})

describe("createSaleSchema", () => {
    const item = { productId: "p1", quantity: 1 }

    it("aplica os padrões de desconto e status", () => {
        const data = createSaleSchema.parse({ items: [item], paymentMethod: "PIX" })
        expect(data.discount).toBe(0)
        expect(data.status).toBe("COMPLETED")
    })

    it("não aceita venda sem itens, quantidade zero ou status CANCELLED na criação", () => {
        expect(createSaleSchema.safeParse({ items: [], paymentMethod: "PIX" }).success).toBe(false)
        expect(createSaleSchema.safeParse({ items: [{ ...item, quantity: 0 }], paymentMethod: "PIX" }).success).toBe(false)
        expect(createSaleSchema.safeParse({ items: [item], paymentMethod: "PIX", status: "CANCELLED" }).success).toBe(false)
    })

    it("não aceita preço vindo do cliente", () => {
        const data = createSaleSchema.parse({ items: [{ ...item, unitPrice: 0.01 }], paymentMethod: "PIX" })
        expect(data.items[0]).toEqual(item)
    })
})