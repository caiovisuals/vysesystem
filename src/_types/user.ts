import { Company } from "./companys"

export type User = {
    id: string
    name: string
    username: string
    email: string
    image?: string
    password: string
    companies: Company[]
    activeCompanyId: string
}