"use client"

import { useState } from "react"
import { Employee } from "@vysesystem/types"
import { useCreateEmployee, useDeleteEmployees, useEmployees, useUpdateEmployee } from "@/_hooks/use-employees"

const NO_EMPLOYEES: Employee[] = []

export default function Employees() {
    const { data = NO_EMPLOYEES, isLoading, error } = useEmployees()
    const createEmployee = useCreateEmployee()
    const updateEmployee = useUpdateEmployee()
    const deleteEmployees = useDeleteEmployees()

    const [editing, setEditing] = useState<Employee | null | undefined>(undefined)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [selectedShift, setSelectedShift] = useState("")

    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold">Colaboradores</h2>
			<span className="text-muted-foreground">Página não disponível</span>
		</div>
    )
}