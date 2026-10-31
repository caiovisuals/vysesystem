import { NextResponse } from "next/server"
import { handleError, requireCompanyId } from "@/_lib/api"
import { getSalesReport } from "@/_lib/sales-report"
import { parseDateParam, requireDateParam } from "@/_lib/sales-query"

export async function GET(req: Request) {
    try {
        const companyId = await requireCompanyId()
        const params = new URL(req.url).searchParams

        const report = await getSalesReport(companyId, {
            todayStart: requireDateParam(params, "todayStart"),
            weekStart: requireDateParam(params, "weekStart"),
            monthStart: requireDateParam(params, "monthStart"),
            periodStart: parseDateParam(params, "periodStart"),
        })
        return NextResponse.json(report)
    } catch (error) {
        return handleError(error)
    }
}