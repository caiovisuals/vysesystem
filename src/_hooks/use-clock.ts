import { useEffect, useState, useCallback } from "react"

interface UseClockOptions {
    locale?: string
    formatOptions?: Intl.DateTimeFormatOptions
}

export function useClock({
    locale = "pt-BR",
    formatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" }
}: UseClockOptions = {}) {
	const [now, setNow] = useState(new Date())

	useEffect(() => {
        const tick = () => setNow(new Date())
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    const formattedTime = useCallback(
        () => now.toLocaleTimeString(locale, formatOptions),
        [now, locale, formatOptions]
    )

	return formattedTime()
}