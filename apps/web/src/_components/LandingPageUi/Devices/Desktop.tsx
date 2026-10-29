import Image from "next/image"

export default function Desktop() {
    return (
        <div aria-hidden="true" className="z-[10] desktop border-3 border-[var(--foreground)] rounded-[18px] absolute bottom-0 max-[1440px]:top-0 max-[1440px]:bottom-auto left-[80px] overflow-hidden lp-overlay-shadow cursor-default select-none">
            <div className="aspect-16/9 lp-overlay-colorbase h-150">
                <div className="flex flex-col size-full">
                    <div className="py-[5px] px-[12px] flex items-center justify-between">
                        <span className="text-[12px] text-[var(--sub-text)]">VyseSystem</span>
                    </div>
                    <div className="w-full relative">
                        <Image src="/landing-page/screens/desktop.png" alt="Desktop" layout="fill" objectFit="cover" className="bg-image-background" />
                    </div>
                    <div className="w-full h-10 bg-[#0A0A0A] flex items-center px-2.5">
                        <img src="/icon.png" alt="logo" className="h-5.5" />
                    </div>
                </div>
            </div>
        </div>
    )
}