import { Employee } from "@vysesystem/types"
import type { EmployeeInput } from "@vysesystem/schemas"
import { request } from "./http"

function reviveEmployee(employee: Employee): Employee {
    return { ...employee, hireDate: new Date(employee.hireDate) }
}

export async function getEmployees() {
    const employees = await request<Employee[]>("/api/employees")
    return employees.map(reviveEmployee)
}

export async function createEmployee(employee: EmployeeInput) {
    return reviveEmployee(await request<Employee>("/api/employees", {
        method: "POST",
        body: JSON.stringify(employee),
    }))
}

export async function updateEmployee(id: string, data: Partial<EmployeeInput>) {
    return reviveEmployee(await request<Employee>(`/api/employees/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    }))
}

export function deleteEmployee(id: string) {
    return request<null>(`/api/employees/${id}`, { method: "DELETE" })
}