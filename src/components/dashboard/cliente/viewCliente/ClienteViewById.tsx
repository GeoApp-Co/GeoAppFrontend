"use client"

import { getClienteById } from "@/src/api/clientApi"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import GoBackButton from "@/src/UI/GoBackButton"
import { translateIdentificacionTypeLong, translatePersonaType } from "@/src/utils"


type ClienteViewByIdProps = {
    id: string
}

function ClienteViewById({ id }: ClienteViewByIdProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["cliente", id],
        queryFn: () => getClienteById({ clienteId: id }),
    })

    if (isLoading) return <LoaderPage />

    if (!data && !isLoading) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-3 bg-white shadow-lg rounded-md space-y-6">
            {/* Header con botón atrás */}
            <div className="flex justify-between">
                <h1 className="text-lg font-semibold text-azul">Detalle del Cliente</h1>
                <GoBackButton />
            </div>

            {/* Card de datos del cliente */}
            {data && (
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-azul font-medium text-base mb-4">Datos del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-700">Nombre</p>
                            <p className="text-gray-600">{data.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Alias</p>
                            <p className="text-gray-600">{data.alias}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Tipo de Persona</p>
                            <p className="text-gray-600">{translatePersonaType(data.personaType)}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Identificación</p>
                            <p className="text-gray-600">
                                {translateIdentificacionTypeLong(data.identificacionType)} {data.identificacion}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Correo</p>
                            <p className="text-gray-600">{data.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Ubicación</p>
                            <p className="text-gray-600">{data.ubicacion}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="font-semibold text-gray-700">Dirección</p>
                            <p className="text-gray-600">{data.direccion}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Card de servicios prestados */}
            <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-azul font-medium text-base mb-4">Servicios Prestados</h2>
                <p className="text-gray-600 text-sm">Lista de manifiestos</p>
            </div>
        </div>
    )
}

export default ClienteViewById
