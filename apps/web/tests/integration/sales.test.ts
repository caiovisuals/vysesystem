import { beforeEach, describe, expect, it } from "vitest"
import { getDb } from "@/_lib/db"
import { PATCH as updateSale } from "@/app/api/sales/[id]/route"
import { POST as createSale } from "@/app/api/sales/route"
import { createUser, jsonRequest, routeParams, signIn } from "./helpers"

let companyId: string

async function createProduct(stock: number, price = 10, company = companyId) {
    const db = getDb()
    const code = ((await db.product.aggregate({ where: { companyId: company }, _max: { code: true } }))._max.code ?? 0) + 1
    return db.product.create({
        data: { companyId: company, code, name: `Produto ${code}`, finalPrice: price, unitCost: 1, quantityInStock: stock },
    })
}

async function stockOf(productId: string) {
    return (await getDb().product.findUniqueOrThrow({ where: { id: productId } })).quantityInStock
}

function postSale(body: object) {
    return createSale(jsonRequest("/api/sales", { paymentMethod: "PIX", ...body }))
}

function patchStatus(id: string, status: string) {
    return updateSale(jsonRequest(`/api/sales/${id}`, { status }, "PATCH"), routeParams(id))
}

beforeEach(async () => {
    const { user, company } = await createUser()
    companyId = company.id
    await signIn(user.id)
})

describe("POST /api/sales", () => {
    it("exige sessão", async () => {
        const { cookieJar } = await import("./cookies")
        cookieJar.clear()
        expect((await postSale({ items: [] })).status).toBe(401)
    })

    it("calcula totais com o preço do banco e baixa o estoque", async () => {
        const product = await createProduct(10, 19.99)

        const res = await postSale({ items: [{ productId: product.id, quantity: 3 }], discount: 0.97 })
        expect(res.status).toBe(201)

        const sale = await res.json()
        expect(sale.subtotal).toBe(59.97)
        expect(sale.total).toBe(59)
        expect(await stockOf(product.id)).toBe(7)
    })

    it("venda pendente não mexe no estoque", async () => {
        const product = await createProduct(10)
        await postSale({ items: [{ productId: product.id, quantity: 3 }], status: "PENDING" })
        expect(await stockOf(product.id)).toBe(10)
    })

    it("recusa estoque insuficiente sem baixar nada", async () => {
        const plenty = await createProduct(10)
        const scarce = await createProduct(1)

        const res = await postSale({ items: [{ productId: plenty.id, quantity: 2 }, { productId: scarce.id, quantity: 2 }] })
        expect(res.status).toBe(409)
        expect(await stockOf(plenty.id)).toBe(10)
        expect(await getDb().sale.count()).toBe(0)
    })

    it("não vende produto de outra empresa", async () => {
        const other = await getDb().company.create({ data: { name: "Outra" } })
        const foreign = await createProduct(10, 10, other.id)

        expect((await postSale({ items: [{ productId: foreign.id, quantity: 1 }] })).status).toBe(404)
        expect(await stockOf(foreign.id)).toBe(10)
    })

    it("recusa desconto maior que o subtotal", async () => {
        const product = await createProduct(10, 5)
        expect((await postSale({ items: [{ productId: product.id, quantity: 1 }], discount: 6 })).status).toBe(400)
    })
})

describe("PATCH /api/sales/[id]", () => {
    it("PENDING → COMPLETED baixa o estoque e COMPLETED → CANCELLED devolve", async () => {
        const product = await createProduct(10)
        const sale = await (await postSale({ items: [{ productId: product.id, quantity: 4 }], status: "PENDING" })).json()

        expect((await patchStatus(sale.id, "COMPLETED")).status).toBe(200)
        expect(await stockOf(product.id)).toBe(6)

        expect((await patchStatus(sale.id, "CANCELLED")).status).toBe(200)
        expect(await stockOf(product.id)).toBe(10)
    })

    it("PENDING → CANCELLED não mexe no estoque", async () => {
        const product = await createProduct(10)
        const sale = await (await postSale({ items: [{ productId: product.id, quantity: 4 }], status: "PENDING" })).json()

        expect((await patchStatus(sale.id, "CANCELLED")).status).toBe(200)
        expect(await stockOf(product.id)).toBe(10)
    })

    it("venda cancelada não volta a ser concluída", async () => {
        const product = await createProduct(10)
        const sale = await (await postSale({ items: [{ productId: product.id, quantity: 1 }] })).json()
        await patchStatus(sale.id, "CANCELLED")

        expect((await patchStatus(sale.id, "COMPLETED")).status).toBe(409)
        expect((await patchStatus(sale.id, "PENDING")).status).toBe(409)
        expect(await stockOf(product.id)).toBe(10)
    })

    it("concluir pendente sem estoque falha e mantém o status", async () => {
        const product = await createProduct(2)
        const sale = await (await postSale({ items: [{ productId: product.id, quantity: 2 }], status: "PENDING" })).json()
        await getDb().product.update({ where: { id: product.id }, data: { quantityInStock: 1 } })

        expect((await patchStatus(sale.id, "COMPLETED")).status).toBe(409)
        expect((await getDb().sale.findUniqueOrThrow({ where: { id: sale.id } })).status).toBe("PENDING")
        expect(await stockOf(product.id)).toBe(1)
    })

    it("cancelar venda com produto excluído não quebra", async () => {
        const product = await createProduct(10)
        const sale = await (await postSale({ items: [{ productId: product.id, quantity: 1 }] })).json()
        await getDb().product.delete({ where: { id: product.id } })

        expect((await patchStatus(sale.id, "CANCELLED")).status).toBe(200)
    })

    it("não altera venda de outra empresa", async () => {
        const product = await createProduct(10)
        const sale = await (await postSale({ items: [{ productId: product.id, quantity: 1 }], status: "PENDING" })).json()

        const { user: intruder } = await createUser({ username: "intruso", email: "intruso@exemplo.com" })
        await signIn(intruder.id)

        expect((await patchStatus(sale.id, "COMPLETED")).status).toBe(404)
        expect(await stockOf(product.id)).toBe(10)
    })
})