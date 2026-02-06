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
        <div className="mobile border-3 border-[var(--foreground)] rounded-[28px] absolute bottom-0 max-[1440px]:top-0 max-[1440px]:bottom-auto left-[16px] overflow-hidden lp-overlay-shadow cursor-default">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-16.5 py-3.5 bg-[var(--foreground)] rounded-b-2xl"/>
            <div className="aspect-9/17 lp-overlay-colorbase w-65">
                <div className="px-4.5 py-2 flex flex-row items-center justify-between gap-[5px]">
                    <span className="text-[12px]">
                        {time}
                    </span>
                    <div className="flex flex-row gap-[5px] items-center">
                    </div>  
                </div>
            </div>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-16.5 h-[5.5px] bg-[var(--foreground)] rounded-full"/>
        </div>
    )
}