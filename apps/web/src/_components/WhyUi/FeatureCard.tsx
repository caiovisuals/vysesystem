interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex flex-col gap-4 p-6 bg-[var(--second-background)] border-2 border-[var(--foreground)] hover:border-[var(--middleground)] rounded-[24px] transition-normal">
            <div className="size-12 flex items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--text-head)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                </svg>
            </div>
            <h3 className="text-[22px]">{title}</h3>
            <p className="text-[var(--sub-text)]">{description}</p>
        </div>
    )
}