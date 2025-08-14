'use client'
import { getItems } from '@/src/api/itemApi'
import GoBackButton from '@/src/UI/GoBackButton'
import Heading from '@/src/UI/Heading'
import { useQuery } from '@tanstack/react-query'
import ItemsPagination from '../ItemsPagination'
import ItemsTable from '../ItemsTable'
import ItemSearchForm from './ClienteSearchForm'

export default function ItemSearch({ page, search }: { page: number, search: string}) {
    const limit = 10

    const { data, isLoading} = useQuery({
        queryKey: ['items', page, limit, search],
        queryFn: () => getItems({ page, limit, search}),
    })


    return (
        <>
            <Heading>Resultados de búsqueda: {search}</Heading>

            <div className="flex  gap-3 items-center justify-between">
                <GoBackButton/>

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