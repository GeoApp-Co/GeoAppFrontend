"use client"
import { getInvoiceManifest, updateManifestInvoiceCode } from '@/src/api/manifestApi'
import { ManifestInvoiceSearchFormData } from '@/src/types'
import Heading from '@/src/UI/Heading'
import { Button } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { selectedItem, selectedManifest } from '../manifiesto-comercial/DashboardCommercialManifesto'
import ManifestInvoicePagination from './ManifestInvoicePagination'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from 'react-toastify'
import ManifestInvoiceSearchForm from './ManifestInvoiceSearchForm'
import ManifestInvoiceTable from './ManifestInvoiceTable'
import CardTotal from '@/src/UI/manifest/CardTotal'
import { ManifestTableSkeleton } from '../manifiesto-comercial/ManifestTableSkeleton'

type DashboardBillingManifestoProps = {
    page: number
}

export type selectedManifestInvoice = Pick<selectedManifest, 'id' | 'items'> & {
    invoiceCode: string
}

function DashboardBillingManifesto( { page } : DashboardBillingManifestoProps) {
    const limit = 10

    // 🟢 estado para los filtros (inicia vacío)
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

    const [selected, setSelected] = useState<selectedManifestInvoice[]>([]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['manifestsInvoice', page, limit, filters], 
        queryFn: () => getInvoiceManifest({ page, limit, ...filters }),
    })


    const { mutate, isPending } = useMutation({
        mutationFn: updateManifestInvoiceCode,
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
        return [...prev, { id: manifestId, invoiceCode: '', items }];
        }
        const newSelected = [...prev];

        const manifest = newSelected[manifestIndex];

        if (manifest.items.length === items.length) {
        // ✅ Ya tenía todos los items → lo quitamos
            newSelected.splice(manifestIndex, 1);
        } else {
        // ✅ Reemplazamos con todos los items (incluyendo price)
            newSelected[manifestIndex] = { id: manifestId, items, invoiceCode: ''};
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
        return [...prev, { id: manifestId, invoiceCode: '', items: [item] }];
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
    const handleInvoiceCodeChange = (newInvoiceCode: string) => {
        setSelected(prev =>
            prev.map(manifest => ({
            ...manifest,
            invoiceCode: newInvoiceCode
            })) 
        );
    };

    const handleUpdateInvoiceCodes = () => {
        const invoiceCodes = selected.flatMap(manifest =>
            ({
                manifestId: manifest.id,
                invoiceCode: manifest.invoiceCode || ''
            })
        );

        mutate({InvoiceCodeFormData:  {invoiceCodes}})
    }


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
            <Heading>Lista de Servicios - (Área de Facturación)</Heading>

            <div className="grid grid-cols-1 gap-3 mt-5 ">
                {/* Pasamos setFilters para que el form lo actualice */}
                <ManifestInvoiceSearchForm setFilters={setFilters} />
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

            {data && data.manifests.length > 0 &&
                <div className="w-full overflow-x-auto rounded-md shadow py-5 flex flex-col gap-2">
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={isPending || selected.length === 0}
                    startIcon={<SaveIcon />}
                    onClick={handleUpdateInvoiceCodes}
                >
                    Guardar Número de Facturación
                </Button>
                <ManifestInvoiceTable
                    manifests={data.manifests}
                    selected={selected}
                    onInvoiceCodeChange={handleInvoiceCodeChange}
                    onToggleManifest={handleToggleManifest}
                    onToggleItem={handleToggleItem}
                    refetch={refetch}
                    totalCantidad={totalCantidad}
                    totalItems={totalItems}
                />
                </div>
            }

            {data && 
                <ManifestInvoicePagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }

            {selected.length > 0 && 
                <CardTotal 
                    selectedItems={selected} 
                    manifestType="invoice" 
                />
            }
        
        </div>
    )
}

export default DashboardBillingManifesto
