import { Company } from "@vysesystem/types"
import type { CompanyInput } from "@vysesystem/schemas"
import { request } from "./http"

export function updateActiveCompany(data: Partial<CompanyInput>) {
    return request<Company>("/api/company", {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}