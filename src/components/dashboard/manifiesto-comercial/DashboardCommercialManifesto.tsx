"use client"
import { getCommercialManifest } from "@/src/api/manifestApi"
import Heading from "@/src/UI/Heading"
import { useQuery } from "@tanstack/react-query"
import ManifestCommercialTable from "./ManifestCommercialTable"
import ManifestCommercePagination from "./ManifestCommercePagination"
import ManifestCommercialSearchForm from "./ManifestCommercialSearchForm"
import { useState } from "react"
import { ManifestCommerceSearchFormData } from "@/src/types"

type DashboardCommercialManifestoProps = {
    page: number
}

function DashboardCommercialManifesto({ page }: DashboardCommercialManifestoProps) {
    const limit = 20

    // 🟢 estado para los filtros (inicia vacío)
    const [filters, setFilters] = useState<ManifestCommerceSearchFormData>({
        clientId: '',
        fechaMes: null,
        item: '',
        location: '',
        manifestTemplate: ''
    })

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['manifestsCommerce', page, limit, filters], // 👈 depende de los filtros
        queryFn: () => getCommercialManifest({ page, limit, ...filters }),
    })

    return (
        <div>
            <Heading>Lista de Servicios</Heading>

            <div className="grid grid-cols-1 gap-3 mt-5 ">
                {/* Pasamos setFilters para que el form lo actualice */}
                <ManifestCommercialSearchForm setFilters={setFilters} />
            </div>

            {isLoading && (
                <h2 className='text-azul text-xl text-center font-black mt-10'>
                    Cargando Datos...
                </h2>
            )}

            {!isLoading && data?.manifests.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}

            {data && data.manifests.length > 0 &&
                <ManifestCommercialTable 
                    manifests={data.manifests} 
                    refetch={refetch}
                />
            }

            {data &&
                <ManifestCommercePagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }
        </div>
    )
}

export default DashboardCommercialManifesto
