export type Company = {
    id: string
    name: string
    image: string
    cnpj: string
    address: string
    phone: string
    status: "open" | "closed"
    createdAt: string
}
