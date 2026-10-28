import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Erro - VyseSystem",
}

export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <h2 className="text-[50px] font-[700] leading-12">Erro</h2>
        </div>
    )
}