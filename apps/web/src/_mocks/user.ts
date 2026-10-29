import { User } from "@vysesystem/types"
import { companys } from "./companys"

const PASSWORD_HASH = "scrypt$16384$8$1$4ixFSGkh74KiPIHffX81lQ==$spALC6S4xJji6ShF4wAkxVv4Bvn8BiKWMcJ8ZRJgkj/d+FkoqN/pmi+KxjMBbyVsBdf8KJDKwcqCXgvEru00Pw=="

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