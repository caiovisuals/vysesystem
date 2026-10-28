"use client"

import { useEffect, useState } from "react"

export default function Mobile() {
    const [time, setTime] = useState("")
    
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const hours = now.getHours().toString().padStart(2, "0")
            const minutes = now.getMinutes().toString().padStart(2, "0")
            setTime(`${hours}:${minutes}`)
        }
    
        updateTime()
        const interval = setInterval(updateTime, 60000)
    
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="z-[11] mobile border-3 border-[var(--foreground)] rounded-[28px] absolute bottom-0 max-[1440px]:top-0 max-[1440px]:bottom-auto left-[14px] overflow-hidden lp-overlay-shadow cursor-default">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-15 py-3.5 bg-[var(--foreground)] rounded-b-2xl" />
            <div className="aspect-9/17 lp-overlay-colorbase w-65">
                <div className="px-5 py-2 flex flex-row items-center justify-between gap-[5px]">
                    <span className="text-[12px] text-[var(--sub-text)]">
                        {time}
                    </span>
                    <div className="flex flex-row gap-[5px] items-center">
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--sub-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h.01" />
                            <path d="M2 8.82a15 15 0 0 1 20 0" />
                            <path d="M5 12.859a10 10 0 0 1 14 0" />
                            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                        </svg>
                        <svg width={16} height={16} viewBox="0 0 26 24" fill="none" stroke="var(--sub-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M24.5 13v-3" />
                            <path d="M6 14v-4" />
                            <rect x="2" y="6" width="19" height="12" rx="2" />
                        </svg>
                    </div>  
                </div>
            </div>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-15 h-[5.5px] bg-[var(--foreground)] rounded-full" />
        </div>
    )
}