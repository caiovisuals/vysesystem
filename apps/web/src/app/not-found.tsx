import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Erro 404 - VyseSystem",
}

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <h2 className="text-[50px] font-[700] leading-12">Erro 404</h2>
            <span className="text-[22px]">Página não encontrada</span>
        </div>
    )
}