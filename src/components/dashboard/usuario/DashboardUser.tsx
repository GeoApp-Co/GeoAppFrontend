"use client"
import { getTemplates } from "@/src/api/templateApi"
import { getUsers } from "@/src/api/userApi"
import { useAuth } from "@/src/hooks/useAuth"
import Heading from "@/src/UI/Heading"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import UserPagination from "./UserPagination"
import UserTable from "./UserTable"
import UserSearchForm from "./searchUser.tsx/UserSearchForm"

type DashboadUserProps = {
    page: number
}

function DashboadUser( { page } :  DashboadUserProps) {

    const { user } = useAuth()
    const router = useRouter()

    const limit = 10

    const { isLoading, data} = useQuery({
        queryKey: ['users', page, limit ],
        queryFn: () => getUsers({page, limit})
    })

    const handleNewTemplate =  () => {
        router.push('/dashboard/usuario/new')
    }

    useEffect(() => {
        if (user?.rol.name !== 'superAdmin') {
            router.replace('/')
        }
    }, [router, user])
    

    return (
        <>
            <Heading>Lista de Usuarios</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                    onClick={handleNewTemplate}
                    className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde transition-colors `}
                >
                    Formulario de Nuevo Usuario
                </button>

                <UserSearchForm/>
            </div>

            {isLoading && 
                <h2 className='text-azul text-xl text-center font-black mt-10'> Cargando Datos...</h2>
            }

            {!isLoading && data?.users.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}
            

            {data && data.users.length > 0  &&
                <UserTable users={data.users} />  
            } 

            {data && 
                <UserPagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }
        </>
    )
}

export default DashboadUser
