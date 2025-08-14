"use client"
import { getItems } from "@/src/api/itemApi"
import { useAuth } from "@/src/hooks/useAuth"
import Heading from "@/src/UI/Heading"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ItemsPagination from "./ItemsPagination"
import ItemsTable from "./ItemsTable"
import ItemSearchForm from "./searchItem/ClienteSearchForm"

type DashboadItemProps = {
    page: number
}

function DashboadItem( { page } :  DashboadItemProps) {

    const { user } = useAuth()
    const router = useRouter()

    const limit = 30

    const { isLoading, data} = useQuery({
        queryKey: ['items', page, limit ],
        queryFn: () => getItems({page, limit})
    })

    const handleNewCliente =  () => {
        router.push('/dashboard/item/new')
    }

    useEffect(() => {
        if (user?.rol.name !== 'admin' && user?.rol.name !== 'superAdmin') {
            router.replace('/')
        }
    }, [router, user])
    

    return (
        <>
            <Heading>Lista de Items</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                    onClick={handleNewCliente}
                    className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde transition-colors `}
                >
                    Formulario de Nuevo Item
                </button>

                <ItemSearchForm/>
            </div>

            {isLoading && 
                <h2 className='text-azul text-xl text-center font-black mt-10'> Cargando Datos...</h2>
            }

            {!isLoading && data?.items.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}
            

            {data && data.items.length > 0  &&
                <ItemsTable items={data.items}/>  
            } 

            {data && 
                <ItemsPagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }
        </>
    )
}

export default DashboadItem
