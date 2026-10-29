import Image from "next/image"

export default function Affirmation() {
    return (
        <div className="w-fit py-2 px-3 flex flex-row gap-2.5 border-2 border-[var(--middleground)] rounded-full items-center">
            <div className="flex flex-row shrink-0">
                <Image src="/landing-page/picture-1.jpg" alt="user-profile" width={25} height={25} className="size-[25px] shrink-0 rounded-full object-cover aspect-square bg-image-background border-2 border-[var(--background)]" />
                <Image src="/landing-page/picture-2.jpg" alt="user-profile" width={25} height={25} className="size-[25px] shrink-0 rounded-full object-cover aspect-square bg-image-background border-2 border-[var(--background)] -ml-2" />
                <Image src="/landing-page/picture-3.jpg" alt="user-profile" width={25} height={25} className="size-[25px] shrink-0 rounded-full object-cover aspect-square bg-image-background border-2 border-[var(--background)] -ml-2" />
            </div>
            <span className="whitespace-nowrap text-[15px] pr-1">Escolhido por +5 mil empresários</span>
        </div>
    )
}