import { NextResponse } from "next/server"
import { handleError, requireCompanyId } from "@/_lib/api"
import { getSalesStats } from "@/_lib/sales-report"
import { saleListFilters } from "@/_lib/sales-query"

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const { status: _, ...filters } = saleListFilters(new URL(req.url).searchParams)
        return NextResponse.json(await getSalesStats(companyId, filters))
    } catch (error) {
        return handleError(error)
    }
}