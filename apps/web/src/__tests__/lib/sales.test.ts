import { describe, expect, it } from "vitest"
import { canChangeSaleStatus, stockEffect } from "@/_lib/sales"

describe("transições de status da venda", () => {
    it.each([
        ["PENDING", "COMPLETED", true, "decrement"],
        ["PENDING", "CANCELLED", true, null],
        ["COMPLETED", "CANCELLED", true, "increment"],
        ["PENDING", "PENDING", false, null],
        ["COMPLETED", "PENDING", false, null],
        ["COMPLETED", "COMPLETED", false, null],
        ["CANCELLED", "PENDING", false, null],
        ["CANCELLED", "COMPLETED", false, null],
        ["CANCELLED", "CANCELLED", false, null],
    ] as const)("%s → %s: permitida=%s, estoque=%s", (from, to, allowed, effect) => {
        expect(canChangeSaleStatus(from, to)).toBe(allowed)
        expect(stockEffect(from, to)).toBe(effect)
    })
})