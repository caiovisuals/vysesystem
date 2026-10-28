import { User } from "@vysesystem/types"
import { companys } from "./companys"

const PASSWORD_HASH = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"

export const users: User[] = [
    {
        id: "1",
        name: "Caio Oliveira",
        username: "caio",
        email: "caio@vysesystem.com",
        image: "/uploads/profile.png",
        password: PASSWORD_HASH,
        companies: [companys[0], companys[1]],
        activeCompanyId: "1"
    },
    {
        id: "2",
        name: "Maria Conceição Souza",
        username: "mariaconcei",
        email: "concemaria@vysesystem.com",
        image: "/uploads/profile.png",
        password: PASSWORD_HASH,
        companies: [companys[1]],
        activeCompanyId: "2"
    },
    {
        id: "3",
        name: "Pedro Almeida",
        username: "pedro",
        email: "pedro@vysesystem.com",
        image: "/uploads/profile.png",
        password: PASSWORD_HASH,
        companies: [companys[2]],
        activeCompanyId: "3"
    },
]