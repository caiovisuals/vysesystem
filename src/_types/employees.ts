export interface Employee {
	id: string
	name: string
    email: string
    phone: string
    salary: number
	role: string
	hireDate: Date
	workShift?: "morning" | "afternoon" | "night" | "full"
}