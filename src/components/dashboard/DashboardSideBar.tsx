import Image from "next/image"
import DashBoardRoute from "./DashBoardRoute"
import Logo from "@/src/UI/Logo"
import { useAuth } from "@/src/hooks/useAuth"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"


const navigation = [
    {url: '/dashboard/manifiesto', text: 'Manifiesto', role: ['admin' , 'conductor']},
    {url: '/dashboard/cliente', text: 'Clientes',  role: ['admin']},
    {url: '/dashboard/item', text: 'Items',  role: ['admin']},
    {url: '/dashboard/plantilla', text: 'Plantillas',  role: ['admin']},
    {url: '/dashboard/usuario', text: 'Usuarios',  role: ['admin']},
]

function DashboardSideBar() {

    const { user } = useAuth()

    const queryClient = useQueryClient();
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        queryClient.invalidateQueries({queryKey: ['user']}); // o el nombre de tu query
        router.push('/auth/login');

    };


    if (user) return (
        <>
        <div className="space-y-3 ">

            {/* <p className="mt-10 uppercase font-bold text-sm text-gray-600 text-center">Navegación</p> */}

            <Logo/>


            <nav className="flex flex-col">
                {navigation.map((link, index) => (
                    link.role.includes(user?.rol.name) &&
                        <DashBoardRoute
                            key={index}
                            link={link}
                        />
                ))}

                <button onClick={handleLogout} className="text-sm px-4 py-2 rounded hover:bg-red-100 text-red-600 font-bold">
                    Cerrar sesión
                </button>

            </nav>
        </div>
        </>
    )
}

export default DashboardSideBar
