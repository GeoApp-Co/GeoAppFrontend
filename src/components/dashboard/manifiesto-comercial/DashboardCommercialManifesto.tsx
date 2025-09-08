"use client"
import { getCommercialManifest, updateManifestQuotationCode } from "@/src/api/manifestApi"
import { ManifestCommerceSearchFormData } from "@/src/types"
import Heading from "@/src/UI/Heading"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ManifestCommercePagination from "./ManifestCommercePagination"
import ManifestCommercialSearchForm from "./ManifestCommercialSearchForm"
import ManifestCommercialTable from "./ManifestCommercialTable"

import SaveIcon from '@mui/icons-material/Save'
import { Button } from "@mui/material"
import { toast } from "react-toastify"

type DashboardCommercialManifestoProps = {
    page: number
}

export type selectedItem = {
    id: number
    cantidad: number
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
        isInvoiced: ''
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

        if (manifestIndex === -1) {
        // 🚀 No existe → agregamos este item
        return [...prev, { id: manifestId, quotationCode: '', items: [item] }];
        }

        const newSelected = [...prev];
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


    const totalCantidad = selected.reduce(
        (sum, manifest) =>
            sum + manifest.items.reduce((s, i) => s + i.cantidad, 0),
        0
    );

    const totalItems = selected.reduce(
        (sum, manifest) => sum + manifest.items.length,
        0
    );

    return (
        <div>
            <Heading>Lista de Servicios - (Área de Comercio)</Heading>

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

                <div className="w-full overflow-x-auto rounded-md shadow py-5 flex flex-col gap-2">
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
                    totalItems={totalItems}
                    totalCantidad={totalCantidad}
                />
                </div>
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
