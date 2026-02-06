interface AvatarProps {
    src?: string
    alt?: string
}

export default function Avatar({ src, alt = "Avatar" }: AvatarProps) {
    return (
        <div className="size-[40px]">
            <img src={src || "/profile.png"} alt={alt} className="rounded-full size-full aspect-square object-cover"/>
        </div>
    )
}