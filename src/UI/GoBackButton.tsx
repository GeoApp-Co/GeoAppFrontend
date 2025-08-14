"use client"
import { useRouter } from "next/navigation"

function GoBackButton() {

    const router = useRouter()

    return (
        <div>
            <button
                onClick={() => router.back()}
                className="bg-azul w-full lg:w-auto text-xl px-5 py-3 text-center font-bold cursor-pointer text-white rounded-2xl  hover:bg-blue-500 "
            >Volver</button>
        </div>
    )
}

export default GoBackButton
