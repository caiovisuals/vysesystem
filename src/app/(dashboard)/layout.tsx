"use client"

import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row w-full h-full">
            <Sidebar/>
            {children}
        </div>
    )
}