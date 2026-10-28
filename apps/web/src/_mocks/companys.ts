import { Company } from "@vysesystem/types"

export const companys: Company[] = [
    {
        id: "1",
        name: "Empresa",
        image: "/uploads/profile.png",
        cnpj: "59949612000178",
        address: "Av. Principal, 123 - Stiep, Salvador - BA",
        phone: "+55 73 98232-7837",
        status: "open",
        createdAt: "2025-06-25T00:00:00"
    },
    {
        id: "2",
        name: "Mercado Bom Preço",
        image: "/uploads/profile.png",
        cnpj: "12345678000190",
        address: "Rua das Flores, 120 - Centro, Ilhéus - BA",
        phone: "+55 73 99812-4410",
        status: "open",
        createdAt: "2025-02-10T00:00:00"
    },
    {
        id: "3",
        name: "Padaria Pão Dourado",
        image: "/uploads/profile.png",
        cnpj: "98765432000110",
        address: "Av. Brasil, 845 - Jardim América, Itabuna - BA",
        phone: "+55 73 98745-2231",
        status: "closed",
        createdAt: "2025-04-22T00:00:00"
    },
]
