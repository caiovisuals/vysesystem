import { describe, expect, it } from "vitest"
import { toQuery } from "@vysesystem/api-client"
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, paginated, parseListQuery, parseNumericQuery } from "@/_lib/pagination"
import { saleListFilters } from "@/_lib/sales-query"

const SORT = { fields: ["name", "email"] as const, default: "name" as const }

function query(search: string) {
    return parseListQuery(new Request(`http://localhost/api/clients${search}`), SORT)
}

describe("parseListQuery", () => {
    it("usa os padrões sem parâmetros", () => {
        expect(query("")).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE, skip: 0, q: "", sortBy: "name", order: "asc" })
    })

    it("calcula o skip a partir da página", () => {
        expect(query("?page=3&pageSize=10")).toMatchObject({ page: 3, pageSize: 10, skip: 20 })
    })

    it.each(["?page=0", "?page=-2", "?page=abc", "?page=1.5"])("página inválida (%s) volta para 1", (search) => {
        expect(query(search).page).toBe(1)
    })

    it("não deixa pedir mais que o máximo por página", () => {
        expect(query(`?pageSize=${MAX_PAGE_SIZE + 1}`).pageSize).toBe(DEFAULT_PAGE_SIZE)
        expect(query(`?pageSize=${MAX_PAGE_SIZE}`).pageSize).toBe(MAX_PAGE_SIZE)
    })

    it("só aceita campos de ordenação da lista", () => {
        expect(query("?sortBy=email&order=desc")).toMatchObject({ sortBy: "email", order: "desc" })
        expect(query("?sortBy=password&order=sideways")).toMatchObject({ sortBy: "name", order: "asc" })
    })

    it("usa a ordem padrão do campo padrão", () => {
        const sales = parseListQuery(new Request("http://localhost/api/sales"), { fields: ["createdAt"], default: "createdAt", order: "desc" })
        expect(sales.order).toBe("desc")
    })

    it("apara e limita o texto da busca", () => {
        expect(query("?q=%20%20maria%20").q).toBe("maria")
        expect(query(`?q=${"a".repeat(300)}`).q).toHaveLength(100)
    })
})

describe("paginated", () => {
    it("calcula o total de páginas", () => {
        expect(paginated([1, 2], 41, { page: 1, pageSize: 20 })).toEqual({ items: [1, 2], page: 1, pageSize: 20, total: 41, totalPages: 3 })
    })

    it("lista vazia tem uma página", () => {
        expect(paginated([], 0, { page: 1, pageSize: 20 }).totalPages).toBe(1)
    })
})

describe("parseNumericQuery", () => {
    it.each([["42", 42], ["007", 7], ["", null], ["4a", null], ["-1", null], ["1234567890", null]] as const)("%s → %s", (input, expected) => {
        expect(parseNumericQuery(input)).toBe(expected)
    })
})

describe("saleListFilters", () => {
    it("aceita status e intervalo de datas válidos", () => {
        const filters = saleListFilters(new URLSearchParams("status=COMPLETED&from=2026-10-01T03:00:00.000Z&to=2026-11-01T03:00:00.000Z"))
        expect(filters).toEqual({
            status: "COMPLETED",
            createdAt: { gte: new Date("2026-10-01T03:00:00.000Z"), lt: new Date("2026-11-01T03:00:00.000Z") },
        })
    })

    it("ignora valores inválidos", () => {
        expect(saleListFilters(new URLSearchParams("status=DELETED&from=ontem"))).toEqual({})
    })
})

describe("toQuery", () => {
    it("ignora valores vazios e converte datas para ISO", () => {
        expect(toQuery({ page: 2, q: "", tag: undefined, from: new Date("2026-10-31T00:00:00.000Z") }))
            .toBe("?page=2&from=2026-10-31T00%3A00%3A00.000Z")
    })

    it("sem parâmetros não gera query string", () => {
        expect(toQuery()).toBe("")
    })
})