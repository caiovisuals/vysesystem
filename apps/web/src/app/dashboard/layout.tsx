"use client"

import Link from "next/link"
import { Toaster } from "react-hot-toast"
import { useClock } from "@/_hooks/use-clock"
import { Sidebar } from "@/_components/Sidebar"
import ProtectedRoute from "@/_components/ProtectedRoute"
import { useAuth } from "@/_contexts/AuthContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth()

    const handleLogout = async () => {
        if (confirm("Tem certeza que deseja sair?")) {
            await logout()
        }
    }

    return (
        <ProtectedRoute>
            <Toaster />
            <div className="flex flex-row w-screen h-screen">
                <Sidebar />
                <div className="flex flex-col w-full h-full">
                    <header className="flex flex-row w-full p-[18px] pb-[0] items-center justify-between">
                        <Link href="/dashboard" className="flex flex-row items-center transition-normal hover:brightness-75">
                            <img src="/logo.png" className="h-[25px]"/>
                        </Link>
                        <div className="flex flex-row items-center justify-center gap-3">
                            <Link href="/dashboard/help">
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-normal hover:brightness-75">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 16v-4"/>
                                    <path d="M12 8h.01"/>
                                </svg>
                            </Link>
                            <Link href="/">
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-normal hover:brightness-75">
                                    <path d="m16 17 5-5-5-5"/>
                                    <path d="M21 12H9"/>
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                </svg>
                            </Link>
                            <button onClick={handleLogout} title="Sair" className="bg-transparent border-none cursor-pointer">
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-normal hover:brightness-75">
                                    <path d="m16 17 5-5-5-5"/>
                                    <path d="M21 12H9"/>
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                </svg>
                            </button>
                        </div>
                    </header>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    )
}