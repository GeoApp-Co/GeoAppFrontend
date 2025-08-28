"use client"
import { getManifestById } from "@/src/api/manifestApi"
import Divider from "@/src/UI/Divider"
import GoBackButton from "@/src/UI/GoBackButton"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { formatDateTimeLarge, formatNumber, traslateMedidas, traslateRoles } from "@/src/utils"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { notFound } from "next/navigation"
import ClientCard from "./ClientCard"
import { useAuth } from "@/src/hooks/useAuth"

type ManifiestViewByIdProps = {
    id: string
}

function ManifiestViewById( { id } : ManifiestViewByIdProps) {

    const { user } = useAuth()

    const { data, isLoading} = useQuery({
        queryKey: ['manifiest', id],
        queryFn: () => getManifestById({manifestId: id}), 
        enabled: !!id
    })

    if (isLoading) return <LoaderPage/>

    if (!data && !isLoading) {
        notFound()
    }
    
    if (data) return (
    <div className="max-w-4xl mx-auto mt-10 p-3 bg-white shadow-lg rounded-md space-y-1">


        <div className="flex flex-col gap-3 lg:flex-row md:justify-between items-center mb-2">
            <h2 className="text-2xl  font-bold text-azul">Manifiesto <span className='font-semibold'>#{formatNumber(data?.id)}</span> </h2>

            <GoBackButton/>

        </div>

        <Divider/>

        <Disclosure as="div" className="">
                <DisclosureButton 
                    className="group flex w-full items-center justify-between"
                >
                    <span 
                    className="py-2 text-left w-full font-medium text-azul"
                    >Datos del Cliente</span>
                    <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                    <ClientCard cliente={data.cliente}/>
                </DisclosurePanel>
        </Disclosure>
        
        <Divider/>

        <Disclosure as="div" className="">
                <DisclosureButton 
                    className="group flex w-full items-center justify-between"
                >
                    <span 
                    className="py-2 text-left w-full font-medium text-azul"
                    >Datos del Manifiesto</span>
                    <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-700">
                        <div><strong>Plantilla:</strong> {data.manifestTemplate.name}</div>
                        <div><strong>Placa Del Vehículo:</strong> {data.plate}</div>
                        <div><strong>Lugar del Servicio:</strong> {data.location}</div>
                        <div><strong>Fecha:</strong> {formatDateTimeLarge(data.date)}</div>
                        <div className="md:col-span-2"><strong>Observaciones:</strong> {data.observations || "Ninguna"}</div>
                    </div>
                </DisclosurePanel>
        </Disclosure>

        <Divider/>

        <Disclosure as="div" className="">
                <DisclosureButton 
                    className="group flex w-full items-center justify-between"
                >
                    <span 
                    className="py-2 text-left w-full font-medium text-azul"
                    >Procesos</span>
                    <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-700">
                        <h2 className="text-lg font-semibold text-azul md:col-span-2">Procesos</h2>
                        
                        <div><strong>Factura:</strong> {data.isInvoiced ? "Sí" : "No"}</div>
                        <div><strong>Disposición Final:</strong> {data.isInternallyInvoiced ? "Sí" : "No"}</div>
                        <div><strong>Certificado:</strong> {data.isCertified ? "Sí" : "No"}</div>
                    </div>
                </DisclosurePanel>
        </Disclosure>

        <Divider/>

        <div>
            <h3 className="text-lg font-bold mb-2 text-azul">Items del manifiesto</h3>
            <table className="w-full text-sm text-left border border-gray-200 rounded-md">
            <thead className="bg-azul text-white">
                <tr>
                <th className="p-2">Código</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Unidad</th>
                <th className="p-2">Cantidad</th>
                </tr>
            </thead>
            <tbody>
                {data.manifestItems.map((m, index) => (
                <tr key={m.id} 
                    className={`border-b ${
                        index % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:bg-blue-100 border-t`}>
                    <td className="p-2">{m.item.code}</td>
                    <td className="p-2">{m.item.name}</td>
                    <td className="p-2">{traslateMedidas(m.item.unidad)}</td>
                    <td className="p-2">{m.cantidad}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        <Divider/>

        <div>
        <h2 className="text-lg font-semibold text-azul md:col-span-2">Evidencias</h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                {data.photos.map((url, index) => (
                    <div key={index} className='relative w-full h-64'>
                    <Image
                        fill
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        style={{ objectFit: 'contain' }}
                    />

                    </div>
                ))}
                </div>
        </div>

        <Divider/>

        <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Cliente */}
                <div>
                <h3 className="text-lg font-medium mb-2 text-azul">Firma del Contacto / Cliente</h3>
                <div className="border rounded w-full aspect-[3/1] mt-2 relative">
                    <Image src={data.signatureClient} alt="Firma Cliente" fill />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Nombre del contacto</label>
                    <p className="bg-gray-100 px-4 py-2 rounded text-sm">{data.contactClient || "No registrado"}</p>
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Cargo del contacto</label>
                    <p className="bg-gray-100 px-4 py-2 rounded text-sm">{data.positionClient || "No registrado"}</p>
                </div>
                </div>

                {/* Conductor */}
                <div>
                <h3 className="text-lg font-medium mb-2 text-azul">Firma del Diligenciador</h3>
                <div className="border rounded w-full aspect-[3/1] mt-2 relative">
                    <Image src={data.signature} alt="Firma Conductor" fill />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Nombre del diligenciador</label>
                    <p className="bg-gray-100 px-4 py-2 rounded text-sm">{data.user?.name || "No registrado"}</p>
                </div>

                </div>
            </div>
        </div>



        </div>
    );

}

export default ManifiestViewById
