import { z } from "zod"
import type { Prisma } from "@/generated/prisma/client"
import { HttpError } from "@/_lib/errors"

const statusSchema = z.enum(["PENDING", "COMPLETED", "CANCELLED"])
const dateSchema = z.iso.datetime({ offset: true }).transform(value => new Date(value))

// Data ISO opcional da URL; valor inválido é ignorado
export function parseDateParam(params: URLSearchParams, name: string): Date | undefined {
    const value = params.get(name)
    if (!value) return undefined
    const result = dateSchema.safeParse(value)
    return result.success ? result.data : undefined
}

// Data ISO obrigatória: os limites de "hoje", "semana" e "mês" vêm do navegador, que sabe o fuso do caixa
export function requireDateParam(params: URLSearchParams, name: string): Date {
    const date = parseDateParam(params, name)
    if (!date) throw new HttpError(`Parâmetro ${name} ausente ou inválido`, 400)
    return date
}

export function createdAtRange(from?: Date, to?: Date): Prisma.DateTimeFilter | undefined {
    if (!from && !to) return undefined
    return { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) }
}

// Filtros ?status=&from=&to= da listagem de vendas
export function saleListFilters(params: URLSearchParams): Prisma.SaleWhereInput {
    const status = statusSchema.safeParse(params.get("status"))
    const createdAt = createdAtRange(parseDateParam(params, "from"), parseDateParam(params, "to"))
    return {
        ...(status.success ? { status: status.data } : {}),
        ...(createdAt ? { createdAt } : {}),
    }
}