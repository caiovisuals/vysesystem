"use client"

import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row w-screen h-screen">
            <Sidebar/>
            <div className="flex flex-col w-full h-full">
                <header className="flex flex-row w-full p-[18px] pb-[0] items-center justify-between">
                    <div className="flex flex-row items-center gap-[5px]">
                        <img src="/logo.png" className="h-[25px]"></img>
                    </div>
                    <Link href="/dashboard/help">
                        <img src="/help.png" className="h-[25px] transition-all duration-300 ease-in-out hover:brightness-75"></img>
                    </Link>
                </header>
                {children}
            </div>
        </div>
    )
}