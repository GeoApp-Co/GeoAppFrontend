import Image from "next/image"

function Logo() {
    return (
        <div className="flex justify-center mt-5">
        <div className="relative w-[80%] aspect-[3/1]">
            <Image
            src="/GeoLogo.png"
            alt="Logo"
            fill
            className="object-contain"
            />
        </div>
        </div>
    )
}
export default Logo
