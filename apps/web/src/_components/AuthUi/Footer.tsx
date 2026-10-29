import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex flex-row w-full p-6 max-[512px]:p-4">
            <Link href="/terms">Termos de Uso</Link>
        </footer>
    )
}