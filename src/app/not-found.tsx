import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Erro 404 - VyseSystem",
	description: "Erro 404",
}

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <h1 className="text-[50px] font-[700] leading-12">Erro 404</h1>
            <h1 className="text-[22px]">Página não encontrada</h1>
        </div>
    )
}