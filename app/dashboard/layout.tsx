"use client"

import { useRouter } from "next/navigation"

function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("AUTH_TOKEN")
        router.replace("/auth/login")
    }

    const handleGoHome = () => {
        router.push("/")
    }

    return (
        <>
        <header className="fixed top-0 left-0 right-0 bg-white shadow z-50 p-4 flex justify-between items-center">
            <button
                onClick={handleGoHome}
                className="px-4 py-2 bg-azul text-white rounded hover:bg-blue-700 transition"
            >
            Menú Principal
            </button>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-200 transition"
            >
            Cerrar Sesión
            </button>
        </header>

        <main className="w-full md:flex-1 md:h-screen md:overflow-y-scroll bg-gray-100 p-5 pt-24">
            {children}
        </main>
        </>
    )
}

export default DashboardLayout