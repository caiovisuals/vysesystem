"use client"

import Image from "next/image"
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
        <div aria-hidden="true" className="z-[11] mobile border-3 border-[var(--foreground)] rounded-[28px] absolute bottom-0 max-[1440px]:top-0 max-[1440px]:bottom-auto left-[14px] overflow-hidden lp-overlay-shadow cursor-default select-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-14.5 py-3.25 bg-[var(--foreground)] rounded-b-2xl" />
            <div className="aspect-9/16 lp-overlay-colorbase w-65">
                <div className="px-3.5 py-1.75 flex flex-row items-center justify-between gap-[5px]">
                    <span className="text-[12px] text-[var(--sub-text)] ml-1">
                        {time}
                    </span>
                    <div className="flex flex-row gap-[4px] items-center">
                        <svg width={14} height={14} viewBox="0 0 24 16" fill="var(--sub-text)" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M0 10.5366C0 9.45897 0.880752 8.58538 1.96721 8.58538C3.05368 8.58538 3.93443 9.45896 3.93443 10.5366V14.0488C3.93443 15.1264 3.05368 16 1.96721 16C0.880752 16 0 15.1264 0 14.0488V10.5366Z" />
                            <path d="M6.68855 7.80093C6.68855 6.72331 7.5693 5.84973 8.65576 5.84973C9.74222 5.84973 10.623 6.72331 10.623 7.80093V14.0488C10.623 15.1264 9.74222 16 8.65576 16C7.5693 16 6.68855 15.1264 6.68855 14.0488V7.80093Z" />
                            <path d="M13.377 5.07314C13.377 3.99552 14.2578 3.12194 15.3442 3.12194C16.4307 3.12194 17.3115 3.99552 17.3115 5.07314V14.0488C17.3115 15.1264 16.4307 16 15.3442 16C14.2578 16 13.377 15.1264 13.377 14.0488V5.07314Z" />
                            <path d="M20.0656 1.9512C20.0656 0.873583 20.9463 0 22.0328 0C23.1192 0 24 0.873582 24 1.9512V14.0488C24 15.1264 23.1192 16 22.0328 16C20.9463 16 20.0656 15.1264 20.0656 14.0488V1.9512Z" />
                        </svg>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--sub-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="h-full w-full relative">
                    <Image src="/landing-page/screens/mobile.png" alt="Mobile" layout="fill" objectFit="cover" className="bg-image-background" />
                </div>
                <div className="w-full bg-[#0A0A0A] flex items-center py-4" />
            </div>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-15 h-[5.5px] bg-[var(--foreground)] rounded-full" />
        </div>
    )
}