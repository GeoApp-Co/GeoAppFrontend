"use client"
import { getDisposicionFinals } from "@/src/api/disposicionFinalApi"
import { getFinalDisposalManifest } from "@/src/api/manifestApi"
import { ItemDisposicionFinalForm, ManifestInvoiceSearchFormData } from "@/src/types"
import Heading from "@/src/UI/Heading"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ManifestInvoiceSearchForm from "../manifiesto-facturacion/ManifestInvoiceSearchForm"
import DisposicionFinalForm from "./DisposicionFinalForm"
import ManifestFinalDisposalTable from "./ManifestFinalDisposalTable"
import { ManifestFinalDisposalTableSkeleton, ManifestFinalDisposalTableNoResults } from "./ManifestFinalDisposalTableSkeleton"
import ManifestDisposalFinalPagination from "./ManifestDisposalFinalPagination"

type DashboardFinalDisposalManifestProps = {
    page: number
}

function DashboardFinalDisposalManifest({ page }: DashboardFinalDisposalManifestProps) {

    const [selectedItem, setSelectedItem] = useState<ItemDisposicionFinalForm | null>(null)

    const [filters, setFilters] = useState<ManifestInvoiceSearchFormData>({
        clientId: '',
        fechaMes: null,
        item: '',
        location: '',
        manifestId: '',
        manifestTemplate: '',
        invoiceCode: '',
        quotationCode: '',
        isInvoiced: ''
    })

    const { data, isLoading , refetch} = useQuery({
        queryKey: ["disposicionFinalManifest", page, filters],
        queryFn: () => getFinalDisposalManifest({ limit: 10, page, ...filters})
    })

    const { data: disposicionFinalData, isLoading: isLoadingDisposicionFinal,} = useQuery({
        queryKey: ["disposicionFinals"],
        queryFn: getDisposicionFinals
    })

    const handleSelectItem = (item: ItemDisposicionFinalForm) => {
        if (selectedItem && selectedItem.manifestItemId === item.manifestItemId) {
            setSelectedItem(null)
        } else {
            setSelectedItem(item)
        }
    }

    return ( 
        <section className="bg-white p-3 space-y-3">
            <Heading>Área De Disposición Final</Heading>

            <div className="grid grid-cols-1 gap-3 mt-5 ">
                <ManifestInvoiceSearchForm setFilters={setFilters} />
            </div>

            {isLoadingDisposicionFinal && <p className="text-center h-20 text-azul">Cargando sitios de disposición final...</p>}

            { disposicionFinalData && selectedItem &&
                <DisposicionFinalForm
                    sitios={disposicionFinalData.disposiciones}
                    selectedItem={selectedItem}
                />
            }

            {isLoading ? (
                <ManifestFinalDisposalTableSkeleton />
            ) : data && data.manifests && data.manifests.length > 0 ? (
                <>
                <ManifestFinalDisposalTable 
                    manifests={data.manifests} 
                    onSelectItem={handleSelectItem}
                    selectedItem={selectedItem}
                    refetch={refetch}
                />
                <ManifestDisposalFinalPagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
                </>
            ) : (
                <ManifestFinalDisposalTableNoResults />
            )}
        </section>
    )
}

export default DashboardFinalDisposalManifest
