interface FaqItemProps {
    question: string
    answer: string
}

export default function FaqItem({ question, answer }: FaqItemProps) {
    return (
        <details className="group border-b-2 border-[var(--foreground)] py-5">
            <summary className="flex flex-row items-center justify-between gap-4 cursor-pointer list-none text-[18px] hover:text-[var(--sub-text)] transition-normal [&::-webkit-details-marker]:hidden">
                {question}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-normal group-open:rotate-45">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </summary>
            <p className="pt-3 text-[var(--sub-text)] max-w-[760px]">{answer}</p>
        </details>
    )
}