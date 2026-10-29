import type { Company } from "./companys"

export type User = {
    id: string
    name: string
    username: string
    email: string
    image?: string
    password: string
    companies: Company[]
    activeCompanyId: string
    sessionVersion?: number
}

export type PublicUser = Omit<User, "password">