import { beforeEach, describe, expect, it } from "vitest"
import type { SalesReport, SalesStats } from "@vysesystem/types"
import { getDb } from "@/_lib/db"
import { GET as listClients } from "@/app/api/clients/route"
import { GET as listProducts } from "@/app/api/products/route"
import { GET as listSales, POST as createSale } from "@/app/api/sales/route"
import { GET as salesReport } from "@/app/api/sales/report/route"
import { GET as salesStats } from "@/app/api/sales/stats/route"
import { createUser, jsonRequest, signIn } from "./helpers"

let companyId: string

function get(url: string) {
    return new Request(`http://localhost:3000${url}`)
}

async function json<T = { items: Record<string, unknown>[], total: number, totalPages: number, page: number }>(res: Response): Promise<T> {
    expect(res.status).toBe(200)
    return res.json() as Promise<T>
}

beforeEach(async () => {
    const { user, company } = await createUser()
    companyId = company.id
    await signIn(user.id)
})

describe("GET /api/clients", () => {
    beforeEach(async () => {
        await getDb().client.createMany({
            data: Array.from({ length: 25 }, (_, i) => ({
                companyId,
                name: `Cliente ${String(i + 1).padStart(2, "0")}`,
                email: `cliente${i + 1}@exemplo.com`,
                tag: i % 5 === 0 ? "vip" : "",
            })),
        })
        // Cliente de outra empresa nunca aparece
        const other = await getDb().company.create({ data: { name: "Outra" } })
        await getDb().client.create({ data: { companyId: other.id, name: "Cliente 00 alheio", email: "x@x.com" } })
    })

    it("pagina em ordem alfabética com o total da empresa", async () => {
        const first = await json(await listClients(get("/api/clients?pageSize=10")))
        expect(first).toMatchObject({ total: 25, totalPages: 3, page: 1 })
        expect(first.items).toHaveLength(10)
        expect(first.items[0].name).toBe("Cliente 01")

        const last = await json(await listClients(get("/api/clients?pageSize=10&page=3")))
        expect(last.items.map(c => c.name)).toEqual(["Cliente 21", "Cliente 22", "Cliente 23", "Cliente 24", "Cliente 25"])
    })

    it("busca sem diferenciar maiúsculas e filtra por tag", async () => {
        const found = await json(await listClients(get("/api/clients?q=CLIENTE1%40")))
        expect(found.items.map(c => c.email)).toEqual(["cliente1@exemplo.com"])

        const vip = await json(await listClients(get("/api/clients?tag=vip")))
        expect(vip.total).toBe(5)
    })

    it("ordena pelo campo pedido", async () => {
        const res = await json(await listClients(get("/api/clients?sortBy=name&order=desc&pageSize=1")))
        expect(res.items[0].name).toBe("Cliente 25")
    })
})

describe("GET /api/products", () => {
    beforeEach(async () => {
        await getDb().product.createMany({
            data: [
                { companyId, code: 1, name: "Refrigerante 2L", finalPrice: 10, unitCost: 5 },
                { companyId, code: 2, name: "Água 500ml", finalPrice: 3, unitCost: 1 },
                { companyId, code: 12, name: "Refrigerante lata", finalPrice: 5, unitCost: 2 },
                { companyId, code: 30, name: "Biscoito 12 unidades", finalPrice: 6, unitCost: 3 },
            ],
        })
    })

    it("coloca o código exato antes dos nomes que contêm o número", async () => {
        const res = await json(await listProducts(get("/api/products?q=12")))
        expect(res.items.map(p => p.code)).toEqual([12, 30])
        expect(res.total).toBe(2)
    })

    it("o código exato não se repete nas páginas seguintes", async () => {
        const first = await json(await listProducts(get("/api/products?q=12&pageSize=1")))
        const second = await json(await listProducts(get("/api/products?q=12&pageSize=1&page=2")))
        expect([...first.items, ...second.items].map(p => p.code)).toEqual([12, 30])
    })

    it("busca por parte do nome", async () => {
        const res = await json(await listProducts(get("/api/products?q=refri")))
        expect(res.items.map(p => p.code)).toEqual([1, 12])
    })
})

describe("vendas: listagem, relatório e estatísticas", () => {
    let productId: string

    beforeEach(async () => {
        const db = getDb()
        productId = (await db.product.create({ data: { companyId, code: 1, name: "Café", finalPrice: 10, unitCost: 4, quantityInStock: 100 } })).id
        const employee = await db.employee.create({ data: { companyId, name: "Ana", email: "ana@x.com", salary: 1, role: "Caixa", hireDate: new Date() } })
        const client = await db.client.create({ data: { companyId, name: "Bruno", email: "b@x.com" } })

        const post = (body: object) => createSale(jsonRequest("/api/sales", { paymentMethod: "PIX", ...body }))
        expect((await post({ items: [{ productId, quantity: 2 }], cashierId: employee.id, customerId: client.id })).status).toBe(201)
        expect((await post({ items: [{ productId, quantity: 1 }], paymentMethod: "MONEY" })).status).toBe(201)
        expect((await post({ items: [{ productId, quantity: 5 }], status: "PENDING" })).status).toBe(201)

        // Venda antiga, fora do mês
        const old = await post({ items: [{ productId, quantity: 3 }], customerId: client.id })
        await db.sale.update({ where: { id: (await old.json()).id }, data: { createdAt: new Date("2020-01-15T12:00:00Z") } })
    })

    it("lista da mais recente para a mais antiga, com filtro de status e busca", async () => {
        const all = await json(await listSales(get("/api/sales?pageSize=2")))
        expect(all).toMatchObject({ total: 4, totalPages: 2 })
        expect(new Date(all.items[0].createdAt as string) >= new Date(all.items[1].createdAt as string)).toBe(true)

        const pending = await json(await listSales(get("/api/sales?status=PENDING")))
        expect(pending.total).toBe(1)

        const byCustomer = await json(await listSales(get("/api/sales?q=brun")))
        expect(byCustomer.total).toBe(2)
    })

    it("agrega o relatório no banco", async () => {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        const qs = `todayStart=${dayStart}&weekStart=${dayStart}&monthStart=${monthStart}`

        const report = await json<SalesReport>(await salesReport(get(`/api/sales/report?${qs}&periodStart=${monthStart}`)))
        expect(report.summary.month).toEqual({ revenue: 30, count: 2 })
        expect(report.summary.period).toEqual({ revenue: 30, count: 2 })
        expect(report.averageTicket).toBe(15)
        expect(report.topEmployees).toEqual([{ id: expect.any(String), name: "Ana", count: 1, value: 20 }])
        expect(report.topCustomers).toEqual([{ id: expect.any(String), name: "Bruno", count: 1, value: 20 }])
        expect(report.topProducts).toEqual([{ id: productId, name: "Café", count: 3, value: 30 }])
        expect(report.paymentMethods).toEqual([
            { method: "PIX", revenue: 20, count: 1 },
            { method: "MONEY", revenue: 10, count: 1 },
        ])

        // Sem periodStart, o período é todo o histórico
        const all = await json<SalesReport>(await salesReport(get(`/api/sales/report?${qs}`)))
        expect(all.summary.period).toEqual({ revenue: 60, count: 3 })
        expect(all.topCustomers[0]).toMatchObject({ name: "Bruno", count: 2, value: 50 })
    })

    it("recusa relatório sem os limites de data", async () => {
        expect((await salesReport(get("/api/sales/report"))).status).toBe(400)
    })

    it("conta as vendas por status", async () => {
        const stats = await json<SalesStats>(await salesStats(get("/api/sales/stats")))
        expect(stats.count).toBe(4)
        expect(stats.byStatus.COMPLETED).toEqual({ revenue: 60, count: 3 })
        expect(stats.byStatus.PENDING).toEqual({ revenue: 50, count: 1 })
        expect(stats.byStatus.CANCELLED).toEqual({ revenue: 0, count: 0 })
    })
})