"use client"
import { getTemplates } from "@/src/api/templateApi"
import { useAuth } from "@/src/hooks/useAuth"
import Heading from "@/src/UI/Heading"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import TemplatePagination from "./TemplatePagination"
import TemplateTable from "./TemplateTable"
import TemplateSearchForm from "./searchTemplate/TemplateSearchForm"

type DashboadTemplateProps = {
    page: number
}

function DashboadTemplate( { page } :  DashboadTemplateProps) {

    const { user } = useAuth()
    const router = useRouter()

    const limit = 20

    const { isLoading, data} = useQuery({
        queryKey: ['templates', page, limit ],
        queryFn: () => getTemplates({page, limit})
    })

    const handleNewTemplate =  () => {
        router.push('/dashboard/plantilla/new')
    }

    useEffect(() => {
        if (user?.rol.name !== 'admin' && user?.rol.name !== 'superAdmin') {
            router.replace('/')
        }
    }, [router, user])
    

    return (
        <>
            <Heading>Lista de Plantillas</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                    onClick={handleNewTemplate}
                    className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde transition-colors `}
                >
                    Formulario de Nueva Plantilla
                </button>

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

export default DashboadTemplate
