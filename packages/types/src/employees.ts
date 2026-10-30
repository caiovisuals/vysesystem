export type WorkShift = "morning" | "afternoon" | "night" | "full"
export interface Employee {
	id: string
	name: string
    email: string
    phone: string
    salary: number
	role: string
	hireDate: Date
	workShift?: WorkShift
}