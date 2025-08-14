'use client'
import { getSelectClient } from '@/src/api/clientApi'
import GoBackButton from '@/src/UI/GoBackButton'
import Heading from '@/src/UI/Heading'
import { useQuery } from '@tanstack/react-query'
import ClientsPagination from '../ClientsPagination'
import ClientsTable from '../ClientsTable'
import ClienteSearchForm from './ClienteSearchForm'

export default function ClienteSearch({ page, search }: { page: number, search: string}) {
    const limit = 10

    const { data, isLoading} = useQuery({
        queryKey: ['clientes', page, limit, search],
        queryFn: () => getSelectClient({ page, limit, search}),
    })


    return (
        <>
            <Heading>Resultados de búsqueda: {search}</Heading>

            <div className="grid grid-cols-1 gap-3 ">
                <GoBackButton/>

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