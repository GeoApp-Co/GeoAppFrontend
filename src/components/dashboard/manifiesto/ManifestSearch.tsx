'use client'
import { getManifest } from '@/src/api/manifestApi'
import Heading from '@/src/UI/Heading'
import { useQuery } from '@tanstack/react-query'
import ManifestPagination from './ManifestPagination'
import ManifestSearchForm from './ManifestSearchForm'
import ManifestTable from './ManifestTable'
import GoBackButton from '@/src/UI/GoBackButton'

export default function ManifestSearch({ page, search, estado, fecha }: { page: number, search: string,estado: string, fecha: string}) {
    const limit = 10

    const { data, isLoading} = useQuery({
        queryKey: ['manifests', page, limit, search, estado, fecha],
        queryFn: () => getManifest({ page, limit, search, estado, fecha}),
    })


    return (
        <>
            <Heading>Resultados de búsqueda: {search}</Heading>

            <div className="grid grid-cols-1 gap-3 ">
                <GoBackButton/>

                <ManifestSearchForm/>
            </div>

            {isLoading && 
                <h2 className='text-azul text-xl text-center font-black mt-10'> Cargando Datos...</h2>
            }

            

            {!isLoading && data?.manifests.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}
            

            {data && data.manifests.length > 0  &&
                <ManifestTable manifests={data.manifests}/>  
                
            } 

            {data && 
                <ManifestPagination 
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }

        </>
    )
}