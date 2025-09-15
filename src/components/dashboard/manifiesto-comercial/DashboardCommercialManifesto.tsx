"use client"
import { getCommercialManifest, updateManifestQuotationCode } from "@/src/api/manifestApi"
import { ItemCategoryType, ManifestCommerceSearchFormData } from "@/src/types"
import Heading from "@/src/UI/Heading"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ManifestCommercePagination from "./ManifestCommercePagination"
import ManifestCommercialSearchForm from "./ManifestCommercialSearchForm"
import ManifestCommercialTable from "./ManifestCommercialTable" // 👈 Import del skeleton
import { ManifestTableSkeleton } from "./ManifestTableSkeleton"
import CardTotal from "@/src/UI/manifest/CardTotal"
import SaveIcon from '@mui/icons-material/Save'
import { Button } from "@mui/material"
import { toast } from "react-toastify"

type DashboardCommercialManifestoProps = {
    page: number
}

export type selectedItem = {
    id: number
    cantidad: number
    isVoiced: boolean
    categoria: ItemCategoryType
}

export type selectedManifest ={
    id: number
    quotationCode: string | null
    items: selectedItem[]
}

function DashboardCommercialManifesto({ page }: DashboardCommercialManifestoProps) {
    const limit = 10

    // 🟢 estado para los filtros (inicia vacío)
    const [filters, setFilters] = useState<ManifestCommerceSearchFormData>({
        clientId: '',
        fechaMes: null,
        item: '',
        location: '',
        manifestId: '',
        manifestTemplate: '',
        quotationCode: '',
        isInvoiced: '',
        invoiceCode: ''
    })

    const [selected, setSelected] = useState<selectedManifest[]>([]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['manifestsCommerce', page, limit, filters], // 👈 depende de los filtros
        queryFn: () => getCommercialManifest({ page, limit, ...filters }),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: updateManifestQuotationCode,
        onError(data) {
            toast.error(data.message)
        },
        onSuccess(data) {
            toast.success(data)
            refetch()
        },
    })

    // ✅ Seleccionar/deseleccionar todo el manifiesto
    const handleToggleManifest = (
        manifestId: number,
        items: selectedItem[]
    ) => {
    setSelected((prev) => {
        const manifestIndex = prev.findIndex((m) => m.id === manifestId);

        // const itemsIsVoiced =  items.filter((item) => item.isVoiced )

        if (manifestIndex === -1) {
        // 🚀 No existe → lo agregamos con todos los items
        return [...prev, { id: manifestId, quotationCode: '', items }];
        }
        const newSelected = [...prev];

        const manifest = newSelected[manifestIndex];

        if (manifest.items.length === items.length) {
        // ✅ Ya tenía todos los items → lo quitamos
            newSelected.splice(manifestIndex, 1);
        } else {
        // ✅ Reemplazamos con todos los items (incluyendo price)
            newSelected[manifestIndex] = { id: manifestId, items, quotationCode: ''};
        }

        return newSelected;
    });
    };

    // ✅ Seleccionar/deseleccionar item individual
    const handleToggleItem = (
    manifestId: number,
    item: selectedItem
    ) => {
    setSelected((prev) => {
        const manifestIndex = prev.findIndex((m) => m.id === manifestId);
        const newSelected = [...prev];

        if (!item.isVoiced) {
            return newSelected
        }

        if (manifestIndex === -1) {
        // 🚀 No existe → agregamos este item
        return [...prev, { id: manifestId, quotationCode: '', items: [item] }];
        }

        const manifest = { ...newSelected[manifestIndex] };
        const items = [...manifest.items];

        // Verificamos si ya estaba seleccionado
        const itemIndex = items.findIndex((i) => i.id === item.id);

        if (itemIndex === -1) {
        // 🚀 No estaba → lo agregamos
        manifest.items = [...items, item];
        } else {
        // 🚀 Ya estaba → lo quitamos
        manifest.items = items.filter((i) => i.id !== item.id);
        }

        if (manifest.items.length === 0) {
        newSelected.splice(manifestIndex, 1);
        } else {
        newSelected[manifestIndex] = manifest;
        }

        return newSelected;
    });
    };

    // ✅ Cambiar precio en TODOS los seleccionados
    const handleQuotationCodeChange = (newQuotationCode: string) => {
        setSelected(prev =>
            prev.map(manifest => ({
            ...manifest,
            quotationCode: newQuotationCode
            }))
        );
    };

    return (
        <div>
            <Heading>Lista de Servicios - (Área de Comercio)</Heading>

            <div className="grid grid-cols-1 gap-3 mt-5 ">
                {/* Pasamos setFilters para que el form lo actualice */}
                <ManifestCommercialSearchForm setFilters={setFilters} />
            </div>

            {/* 🔄 SKELETON - Mostrar mientras carga */}
            {isLoading && (
                <div className="py-5">
                    <div className="mb-4">
                        {/* Skeleton del botón */}
                        <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    {/* Skeleton de la tabla */}
                    <ManifestTableSkeleton rows={limit} />
                </div>
            )}

            {/* 📭 ESTADO VACÍO - No hay resultados */}
            {!isLoading && data?.manifests.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-azul text-xl font-black mb-2">
                        No hay manifiestos
                    </h2>
                    <p className="text-gray-500">
                        No se encontraron manifiestos con los filtros aplicados
                    </p>
                </div>
            )}

            {/* ✅ CONTENIDO - Cuando hay datos */}
            {!isLoading && data && data.manifests.length > 0 && (
                <div className="w-full overflow-x-auto py-5 flex flex-col gap-2">
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={isPending || selected.length === 0}
                        startIcon={<SaveIcon />}
                        onClick={() => {
                            // construimos payload
                            const quotationCodes = selected.flatMap(manifest =>
                                ({
                                    manifestId: manifest.id,
                                    quotationCode: manifest.quotationCode || ''
                                })
                            );

                            mutate({quotationCodeFormType:  {quotationCodes}})
                        }}
                    >
                        Guardar Número de Cotización
                    </Button>
                    <ManifestCommercialTable
                        selected={selected}
                        onToggleItem={handleToggleItem}
                        onToggleManifest={handleToggleManifest}
                        onQuotationCodeChange={handleQuotationCodeChange}
                        manifests={data.manifests} 
                        refetch={refetch}
                    />
                </div>
            )}

            {/* 📄 PAGINACIÓN - Solo cuando hay datos */}
            {!isLoading && data && (
                <ManifestCommercePagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            )}

            {/* 📊 CARD TOTAL - Solo cuando hay selecciones */}
            {selected.length > 0 && 
                <CardTotal 
                    selectedItems={selected} 
                    manifestType="quotation" 
                />
            }
        </div>
    )
}

export default DashboardCommercialManifesto