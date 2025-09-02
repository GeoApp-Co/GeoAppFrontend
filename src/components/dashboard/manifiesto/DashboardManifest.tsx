'use client'
import { getManifest } from '@/src/api/manifestApi'
import Heading from '@/src/UI/Heading'
import { useQuery } from '@tanstack/react-query'
import "react-datepicker/dist/react-datepicker.css"
import ManifestPagination from './ManifestPagination'
import ManifestSearchForm from './ManifestSearchForm'
import ManifestTable from './ManifestTable'


export default function DashboardManifest({ page }: { page: number }) {
    const limit = 10

    const { data, isLoading  } = useQuery({
        queryKey: ['manifests', page, limit],
        queryFn: () => getManifest({ page, limit, clientId: '' }),
    })

    return (
        <div>
            <Heading>Lista de Servicios</Heading>

            <div className="grid grid-cols-1 gap-3 mt-5 ">


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
        </div>
    )
}