import { Employee } from "@vysesystem/types"

export const employees: Employee[] = [
    {
        id: "1",
        name: "Jonh",
        email: "jonh@vysesystem.com",
        phone: "(11) 93154-4613",
        salary: 3500,
        role: "gerente",
        hireDate: new Date("2024-01-15T00:00:00"),
        workShift: "morning"
    },
    {
        id: "2",
        name: "Roberto",
        email: "roberto@vysesystem.com",
        phone: "(15) 98312-1530",
        salary: 3800,
        role: "gerente",
        hireDate: new Date("2024-01-15T00:00:00"),
        workShift: "morning"
    },
    {
        id: "3",
        name: "Ana Paula",
        email: "ana@vysesystem.com",
        phone: "(73) 99145-2278",
        salary: 2200,
        role: "caixa",
        hireDate: new Date("2024-03-04T00:00:00"),
        workShift: "afternoon"
    },
    {
        id: "4",
        name: "Lucas Ferreira",
        email: "lucas@vysesystem.com",
        phone: "(73) 98823-6619",
        salary: 2000,
        role: "repositor",
        hireDate: new Date("2024-06-10T00:00:00"),
        workShift: "morning"
    },
    {
        id: "5",
        name: "Juliana Santos",
        email: "juliana@vysesystem.com",
        phone: "(71) 99712-3045",
        salary: 2400,
        role: "vendedor",
        hireDate: new Date("2024-09-02T00:00:00"),
        workShift: "full"
    },
    {
        id: "6",
        name: "Carlos Mendes",
        email: "carlos@vysesystem.com",
        phone: "(73) 98156-7720",
        salary: 2100,
        role: "segurança",
        hireDate: new Date("2025-01-20T00:00:00"),
        workShift: "night"
    },
]