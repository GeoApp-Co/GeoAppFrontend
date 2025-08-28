"use client"
import { getSelectClient } from "@/src/api/clientApi"
import { useAuth } from "@/src/hooks/useAuth"
import Heading from "@/src/UI/Heading"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ClientsPagination from "./ClientsPagination"
import ClientsTable from "./ClientsTable"
import ClienteSearchForm from "./searchCliente/ClienteSearchForm"

type DashboardClienteProps = {
    page: number
}

function DashboardCliente( { page } :  DashboardClienteProps) {

    const { user } = useAuth()
    const router = useRouter()

    const limit = 10

    const { isLoading, data} = useQuery({
        queryKey: ['clientes', page, limit ],
        queryFn: () => getSelectClient({page, limit})
    })

    const handleNewCliente =  () => {
        router.push('/dashboard/cliente/new')
    }

    useEffect(() => {
        if (user?.rol.name !== 'admin' && user?.rol.name !== 'superAdmin' && user?.rol.name !== 'comercio') {
            router.replace('/')
        }
    }, [router, user])
    

    
    return (
        <>
            <Heading>Lista de Clientes</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                    onClick={handleNewCliente}
                    className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde  transition-colors `}
                >
                    Formulario de Nuevo Cliente
                </button>

                <ClienteSearchForm/>
            </div>

            {isLoading && 
                <h2 className='text-azul text-xl text-center font-black mt-10'> Cargando Datos...</h2>
            }

            {!isLoading && data?.clientes.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}
            

            {data && data.clientes.length > 0  &&
                <ClientsTable clients={data.clientes}/>  
            } 

            {data && 
                <ClientsPagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }
        </>
    )
}

export default DashboardCliente
