import type { Paginated } from "@vysesystem/types"

type QueryValue = string | number | boolean | Date | null | undefined

export function toQuery(params: object = {}): string {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params as Record<string, QueryValue>)) {
        if (value === undefined || value === null || value === "") continue
        search.set(key, value instanceof Date ? value.toISOString() : String(value))
    }
    const query = search.toString()
    return query ? `?${query}` : ""
}

export function mapPage<T, R>(page: Paginated<T>, fn: (item: T) => R): Paginated<R> {
    return { ...page, items: page.items.map(fn) }
}