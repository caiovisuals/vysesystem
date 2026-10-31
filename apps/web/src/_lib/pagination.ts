import { z } from "zod"
import type { Paginated, SortOrder } from "@vysesystem/types"

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
const MAX_QUERY_LENGTH = 100

// Valores fora do intervalo voltam ao padrão em vez de dar erro: a URL pode ter sido editada à mão
const pageSchema = z.coerce.number().int().min(1).catch(1)
const pageSizeSchema = z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).catch(DEFAULT_PAGE_SIZE)

export type ListQuery<S extends string> = {
    page: number
    pageSize: number
    skip: number
    q: string
    sortBy: S
    order: SortOrder
}

// Lê ?page=&pageSize=&q=&sortBy=&order= da URL. sortBy só aceita os campos da lista (vira orderBy do Prisma)
export function parseListQuery<S extends string>(
    req: Request,
    sort: { fields: readonly S[], default: S, order?: SortOrder },
): ListQuery<S> {
    const params = new URL(req.url).searchParams

    const page = pageSchema.parse(params.get("page") ?? undefined)
    const pageSize = pageSizeSchema.parse(params.get("pageSize") ?? undefined)
    const q = (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH)

    const requestedSort = params.get("sortBy") as S | null
    const sortBy = requestedSort && sort.fields.includes(requestedSort) ? requestedSort : sort.default
    const requestedOrder = params.get("order")
    const order: SortOrder = requestedOrder === "asc" || requestedOrder === "desc"
        ? requestedOrder
        : (sortBy === sort.default ? sort.order ?? "asc" : "asc")

    return { page, pageSize, skip: (page - 1) * pageSize, q, sortBy, order }
}

export function paginated<T>(items: T[], total: number, query: { page: number, pageSize: number }): Paginated<T> {
    return {
        items,
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    }
}

// Filtro "contém, ignorando maiúsculas" do Prisma
export function contains(q: string) {
    return { contains: q, mode: "insensitive" as const }
}

// Número inteiro positivo escrito na busca (código do produto, número da venda); senão null
export function parseNumericQuery(q: string): number | null {
    if (!/^\d{1,9}$/.test(q)) return null
    return Number(q)
}