import { User } from "@/types/user"

export const users: User[] = [
    {
        id: "1",
        name: "Caio",
        username: "caiote",
        email: "caiote@gmail.com",
        image: "/uploads/profile.png",
        password: "caio1234#$",
        activeCompanyId: "1",
        companies: [
            {
                id: "1",
                name: "Doce Mel",
                cnpj: "00.000.000/0001-00",
                address: "Rua Central, 123",
                phone: "+55 73 91234-5678",
                status: "open",
                createdAt: "2025-01-01",
            },
            {
                id: "2",
                name: "Boa Brasa",
                cnpj: "",
                address: "",
                phone: "",
                status: "closed",
                createdAt: "2025-01-01",
            },
        ],
    },
]
