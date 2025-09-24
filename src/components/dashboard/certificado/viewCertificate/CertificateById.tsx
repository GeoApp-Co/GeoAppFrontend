"use client"

import { getCertificateById } from "@/src/api/certificateApi"
import GoBackButtonMUI from "@/src/UI/GoBackButtonMUI"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { translateMedidasSimbolos } from "@/src/utils"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import Image from "next/image"
import { notFound } from "next/navigation"
import React, { useRef } from "react"
import { useReactToPrint } from "react-to-print"

type CertificateByIdProps = {
    id: string
}

function CertificateById( { id } : CertificateByIdProps) {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['certificateById', id],
        queryFn: () => getCertificateById(Number(id)),
        enabled: !!id
    })

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    

    if (isError) return notFound()

    if (isLoading) return <LoaderPage/>

    if (data) return (
        <div>

            <div className="flex justify-between">
            <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={reactToPrintFn}
            >
                Descargar PDF
            </button>

            <GoBackButtonMUI/>

            </div>

            <div ref={contentRef} className="mx-auto my-8 bg-white shadow-lg rounded-lg border border-gray-200 p-3 w-full max-w-[1123px] min-h-[794px] flex flex-col print:landscape">
            

                <div className="flex flex-row justify-between items-start mb-2">
                    {/* Logo */}
                    <div className="relative w-72 h-28">
                        <Image src="/GeoLogo.webp" alt={data.code} fill className="object-contain" />
                    </div>
                    {/* Datos al lado del logo */}
                    <div className="flex flex-col items-end text-xs leading-tight text-right min-w-[260px]">
                        <span className="font-bold uppercase tracking-wide">GEOASEO S.A.S E.S.P</span>
                        <span className="">NIT: 900.934.620-1</span>
                        <span className="">R.L. JHONNATTAN A. SÁNCHEZ HERNANDEZ</span>
                        <span className="">CRA 22 # 4 70</span>
                        <span className="">3032994306</span>
                        <span className="text-blue-700 underline cursor-pointer">Gerencia@geoaseo.co</span>
                        <span className="">Aguachica Cesar</span>
                    </div>
                </div>

                {/* Título */}
                <div className="text-center mb-2">
                    <h2 className="font-bold text-base uppercase tracking-wide">Certificado de Gestión Integral de Residuos</h2>
                    <div className="font-semibold text-sm">No <span className="text-blue-700">{data.code}</span></div>
                </div>

                {/* Tabla: Datos básicos del gestor */}
                <div className="border border-gray-400 rounded mb-2 overflow-hidden">
                        <div className="bg-gray-100 border-b border-gray-400 px-2 py-1 text-xs font-bold uppercase text-center">Datos básicos del gestor</div>
                        <table className="w-full text-xs">
                            <tbody>
                                <tr>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left w-1/6">Nombre</th>
                                    <td className="border-r border-b border-gray-300 px-2 py-1">GEOASEO S.A.S E.S.P</td>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left w-1/6">Rep. Legal</th>
                                    <td className="border-b border-gray-300 px-2 py-1">Jhonnattan Sánchez H</td>
                                </tr>
                                <tr>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left">NIT</th>
                                    <td className="border-r border-b border-gray-300 px-2 py-1">900.934.620-1</td>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left">Tel.</th>
                                    <td className="border-b border-gray-300 px-2 py-1">3182102427</td>
                                </tr>
                                <tr>
                                    <th className="bg-gray-50 border-r border-gray-300 px-2 py-1 font-semibold text-left">Dir.</th>
                                    <td className="border-r border-gray-300 px-2 py-1">Cra 22 4 70</td>
                                    <th className="bg-gray-50 border-r border-gray-300 px-2 py-1 font-semibold text-left">Mun.</th>
                                    <td className="px-2 py-1">Aguachica</td>
                                </tr>
                            </tbody>
                        </table>
                </div>


                {/* Tabla: Datos básicos del generador */}
                <div className="border border-gray-400 rounded mb-4 overflow-hidden">
                        <div className="bg-gray-100 border-b border-gray-400 px-2 py-1 text-xs font-bold uppercase text-center">Datos básicos del generador</div>
                        <table className="w-full text-xs">
                            <tbody>
                                <tr>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left w-1/6">Nombre</th>
                                    <td className="border-r border-b border-gray-300 px-2 py-1 max-w-[180px] break-words">{data?.cliente.name || '-'}</td>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left w-1/6">Rep. Legal</th>
                                    <td className="border-b border-gray-300 px-2 py-1">{data?.cliente.contacto || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left">ID</th>
                                    <td className="border-r border-b border-gray-300 px-2 py-1">{data?.cliente.identificacion || '-'}</td>
                                    <th className="bg-gray-50 border-r border-b border-gray-300 px-2 py-1 font-semibold text-left">Tel.</th>
                                    <td className="border-b border-gray-300 px-2 py-1">{data?.cliente.phone1 || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="bg-gray-50 border-r border-gray-300 px-2 py-1 font-semibold text-left">Ciudad</th>
                                    <td className="border-r border-gray-300 px-2 py-1">{data?.cliente.ubicacion || '-'}</td>
                                    <th className="bg-gray-50 border-r border-gray-300 px-2 py-1 font-semibold text-left">Dir.</th>
                                    <td className="px-2 py-1">{data?.cliente.direccion || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                </div>

                {/* Tabla: Ítems/Residuos (horizontal, con lugar y licencia antes de tratamiento) */}
                <div className="border border-gray-400 rounded mb-4 overflow-hidden print:landscape">
                    <div className="bg-gray-100 border-b border-gray-400 px-2 py-1 text-xs font-bold uppercase text-center">Tipo de Residuo</div>
                    <table className="w-full text-xs">
                        <thead>
                            <tr>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center w-6">#</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[80px] max-w-[120px] break-words">Categoría</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[100px] max-w-[140px] break-words">Nombre</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[80px] max-w-[120px] break-words">Lugar</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[80px] max-w-[120px] break-words">Licencia</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[80px] max-w-[120px] break-words">Tratamiento</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[60px] max-w-[80px] break-words">Unidad</th>
                                <th className="border-r border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[60px] max-w-[80px] break-words">Cant.</th>
                                <th className="border-b border-gray-300 px-1 py-1 font-semibold text-center min-w-[80px] max-w-[100px] break-words">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.manifestItems && data.manifestItems.length > 0 ? (
                                data.manifestItems.map((item, idx) => (
                                    <tr key={item.id} className={idx % 2 === 0 ? '' : 'bg-gray-50'}>
                                        <td className="border-r border-b border-gray-300 px-1 py-2 text-center align-top text-[11px] font-medium">{idx + 1}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[120px] break-words text-[11px] capitalize text-left">{item.item.categoria || '-'}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[140px] break-words text-[11px] capitalize text-left font-medium">{item.item.name || '-'}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[120px] break-words text-[11px] capitalize text-left">{item.disposicionFinal?.sitio?.nombre || '-'}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[120px] break-words text-[11px] capitalize text-left">{item.disposicionFinal?.licencia?.licencia || '-'}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[120px] break-words text-[11px] capitalize text-left">{item.disposicionFinal?.tratamiento || '-'}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[80px] break-words text-[11px] lowercase text-left">{translateMedidasSimbolos(item.item.unidad) || '-'}</td>
                                        <td className="border-r border-b border-gray-300 px-2 py-2 align-top max-w-[80px] break-words text-[11px] text-left">{item.cantidad || '-'}</td>
                                        <td className="border-b border-gray-300 px-2 py-2 align-top max-w-[100px] break-words text-[11px] text-left">{item.fechaDisposicionFinal ? dayjs(item.fechaDisposicionFinal).format("DD/MM/YYYY") : '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center py-2">No hay residuos registrados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pie de página fijo (firmas y mensaje final) */}
                <div className="pt-8 ">
                    <div className="flex flex-row justify-between items-end mb-2 w-full">
                        <div className="flex flex-col items-center w-1/2">
                            <div className="relative w-52 h-20 mb-2">
                                <Image src="/Firma_Gerencia.png" alt="Firma Gerencia" fill className="object-contain" />
                            </div>
                            <span className="font-bold uppercase text-xs text-center">JHONNATTAN AUSTHIN SÁNCHEZ HERNANDEZ</span>
                            <span className="text-xs text-center">Representante legal</span>
                        </div>
                        <div className="flex flex-col items-center w-1/2">
                            <div className="relative w-52 h-20 mb-2">
                                <Image src="/Firma_Facturacion.png" alt="Firma Facturación" fill className="object-contain" />
                            </div>
                            <span className="font-bold uppercase text-xs text-center">ASTRID ELJURE GONZALEZ</span>
                            <span className="text-xs text-center">Gerente Facturación y Certificación</span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-center">
                        Para validar el certificado puede comunicarse a la línea de teléfono y WhatsApp 3182102427, al correo electrónico
                        <span className="text-blue-700"> comercial@geoaseo.co </span>
                        o ingresar a la página web <span className="text-blue-700">www.geoaseo.co</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CertificateById
