export default function Loading() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center gap-4 w-screen h-screen"
        >
            <div className="w-14 h-14 rounded-full border-4 border-[var(--middleground)] border-t-[var(--text-head)] animate-spin" />
        </div>
    )
}