'use client'
import { getTemplates } from '@/src/api/templateApi'
import GoBackButton from '@/src/UI/GoBackButton'
import Heading from '@/src/UI/Heading'
import { useQuery } from '@tanstack/react-query'
import TemplatePagination from '../TemplatePagination'
import TemplateTable from '../TemplateTable'
import TemplateSearchForm from './TemplateSearchForm'

export default function TemplateSearch({ page, search }: { page: number, search: string}) {
    const limit = 10

    const { data, isLoading} = useQuery({
        queryKey: ['templates', page, limit, search],
        queryFn: () => getTemplates({ page, limit, search}),
    })


    return (
        <>
            <Heading>Resultados de búsqueda: {search}</Heading>

            <div className="flex gap-3 items-center justify-between">
                <GoBackButton/>

                <TemplateSearchForm/>
            </div>

            {isLoading && 
                <h2 className='text-azul text-xl text-center font-black mt-10'> Cargando Datos...</h2>
            }

            {!isLoading && data?.templates.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}
            

            {data && data.templates.length > 0  &&
                <TemplateTable templates={data.templates}/>  
                
            } 

            {data && 
                <TemplatePagination 
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }

        </>
    )
}