import { employees } from "@/mocks/employees"
import { EmployeeTableItem } from "@/types/employees"

export default function Employees() {
    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold">Colaboradores</h2>
			<span className="text-muted-foreground">Página não disponível</span>
		</div>
    )
}