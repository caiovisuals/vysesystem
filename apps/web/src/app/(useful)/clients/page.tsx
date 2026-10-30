import Image from "next/image"
import Link from "next/link"

export default function Clients() {
    return (
        <div>
            <section id="hero"></section>
            <section id="clients-range">
                <div className="grid max-w-7xl grid-cols-6 gap-x-8 gap-y-4.5 max-xl:grid-cols-4 max-xl:gap-y-5 max-lg:gap-x-5 max-lg:gap-y-3 max-md:grid-cols-3 max-md:gap-x-4 max-md:gap-y-2">
                    <Image src="/clients/1.png" alt="Client 1" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/2.png" alt="Client 2" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/3.png" alt="Client 3" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/4.png" alt="Client 4" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/5.png" alt="Client 5" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/6.png" alt="Client 6" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/7.png" alt="Client 7" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/8.png" alt="Client 8" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/9.png" alt="Client 9" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/10.png" alt="Client 10" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/11.png" alt="Client 11" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                    <Image src="/clients/12.png" alt="Client 12" width={180} height={80} className="w-full h-12 aspect-[180/80] object-contain" />
                </div>
            </section>
            <section id="cta">
                <h1>O CRM por trás de milhares de empresas.</h1>
                <div>
                    <Link href="/about">Conheça a Vyse</Link>
                    <Link href="/integration">Integre ao seu negócio</Link>
                </div>
            </section>
        </div>
    )
}