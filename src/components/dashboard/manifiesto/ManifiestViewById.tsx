"use client";
import { GroupedItems, ManifestByIdType } from "@/src/types";
import {
    formatDateTimeLarge,
    formatNumber,
    translateMedidasSimbolos,
} from "@/src/utils";
import { Checkbox } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

type ManifiestViewByIdProps = {
    manifest:  ManifestByIdType
};

function ManifiestViewById({ manifest }: ManifiestViewByIdProps) {

    const groupedItems = useMemo(() => {
        if (!manifest) return {};
        return manifest.manifestItems.reduce<GroupedItems>((acc, item) => {
        const categoria = item.item.categoria || "OTRO";
        if (!acc[categoria]) acc[categoria] = [];
        acc[categoria].push(item);
        return acc;
        }, {});
    }, [manifest])

    if (manifest)
        return (
        <div
            className="max-w-5xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-md space-y-6 print:max-w-full print:shadow-none print:rounded-none print:p-2 print:space-y-2 print:text-[11px]"
        >
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-4 print:mb-2">
            <div className="w-36 h-16 relative print:w-28 print:h-12">
                <Image
                src="/GeoLogo.webp"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                />
            </div>
            </div>

            {/* Datos Manifiesto */}
            <h3
            className="text-lg font-semibold text-azul mb-2 print:text-sm print:mb-1"
            >
            Datos del Manifiesto
            </h3>
            <table
            className="w-full border border-gray-300 text-sm text-gray-700 print:text-[10px] print:border-black"
            >
            <tbody>
                <tr>
                <td className="p-1 font-semibold border w-40 bg-gray-100">
                    Manifiesto
                </td>
                <td colSpan={3} className="p-1 border uppercase">
                    {manifest.manifestTemplate.name}
                </td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border w-40 bg-gray-100">
                    Serial
                </td>
                <td className="p-1 border"># {formatNumber(manifest.id)}</td>
                <td className="p-1 font-semibold border w-40 bg-gray-100">
                    Lugar del Servicio
                </td>
                <td className="p-1 border">{manifest.location}</td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border bg-gray-100">
                    Fecha Inicial
                </td>
                <td className="p-1 border">{formatDateTimeLarge(manifest.date)}</td>
                <td className="p-1 font-semibold border bg-gray-100">
                    Fecha Final
                </td>
                <td className="p-1 border">
                    {formatDateTimeLarge(manifest.dateFinal)}
                </td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border bg-gray-100">
                    Placa Vehículo
                </td>
                <td className="p-1 border">{manifest.car.plate}</td>
                <td className="p-1 font-semibold border bg-gray-100">
                    Tipo Vehículo
                </td>
                <td className="p-1 border">{manifest.car.carType}</td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border bg-gray-100">
                    Observaciones
                </td>
                <td colSpan={3} className="p-1 border">
                    {manifest.observations || "Ninguna"}
                </td>
                </tr>
            </tbody>
            </table>

            {/* Datos Cliente */}
            <h3
            className="text-lg font-semibold text-azul mb-2 print:text-sm print:mb-1"
            >
            Datos del Cliente
            </h3>
            <table
            className="w-full border border-gray-300 text-sm text-gray-700 print:text-[10px] print:border-black"
            >
            <tbody>
                <tr>
                <td className="p-1 font-semibold border w-40 bg-gray-100">
                    Cliente
                </td>
                <td className="p-1 border">{manifest.cliente.name}</td>
                <td className="p-1 font-semibold border w-40 bg-gray-100">
                    Alias
                </td>
                <td className="p-1 border">{manifest.cliente.alias}</td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border bg-gray-100">
                    Tipo Persona
                </td>
                <td className="p-1 border">{manifest.cliente.personaType}</td>
                <td className="p-1 font-semibold border bg-gray-100">
                    Identificación
                </td>
                <td className="p-1 border">
                    {manifest.cliente.identificacionType} {manifest.cliente.identificacion}
                </td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border bg-gray-100">Correo</td>
                <td className="p-1 border">{manifest.cliente.email}</td>
                <td className="p-1 font-semibold border bg-gray-100">
                    Ubicación
                </td>
                <td className="p-1 border">{manifest.cliente.ubicacion}</td>
                </tr>
                <tr>
                <td className="p-1 font-semibold border bg-gray-100">
                    Dirección
                </td>
                <td colSpan={3} className="p-1 border">
                    {manifest.cliente.direccion}
                </td>
                </tr>
            </tbody>
            </table>

            {/* Items */}
            <div>
            <h3
                className="text-lg font-bold mb-3 text-center text-azul print:text-sm print:mb-1 uppercase"
            >
                {manifest.manifestTemplate.name}
            </h3>
            {Object.entries(groupedItems).map(([categoria, items]) => {
            const isSpecialCategory = categoria.toLowerCase() === "especial";
            const totalCategoria = items.reduce((acc, item) => acc + +item.cantidad, 0);

            return (
                <div key={categoria} className="mb-6 print:mb-2 print-break-inside-avoid">
                <h4
                    className="text-md text-center font-semibold p-2 bg-azul text-white print:bg-gray-200 print:text-black print:p-1 print:text-xs"
                >
                    {categoria}
                </h4>
                <table
                    className="w-full text-sm text-left border border-gray-300 rounded-md print:text-[10px] print:border-black"
                >
                    <thead>
                    <tr className="bg-azul text-white text-sm print:bg-gray-200 print:text-black print:text-[10px]">
                        <th className="p-1 w-20">Código</th>
                        <th className="p-1">Nombre</th>
                        <th className="p-1 text-right w-20">Unidad</th>
                        <th className="p-1 text-right w-20">Cantidad</th>
                        {isSpecialCategory && (
                        <>
                            <th className="p-1 text-right w-32">Vol. Desechos</th>
                            <th className="p-1 text-right w-20"># Viajes</th>
                            <th className="p-1 text-right w-20"># Horas</th>
                        </>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((m) => {
                        const isAromatizante =
                            categoria.toLowerCase().includes("servicio") ||
                            m.item.name.toLowerCase().includes("aromatizante");

                        return (
                            <tr
                                key={m.id}
                                className="border-b hover:bg-blue-100 print:hover:bg-transparent print:border-black"
                            >
                                <td className="p-1 w-20">{m.item.code}</td>
                                <td className="p-1">{m.item.name}</td>
                                <td className="p-1 text-right w-20">
                                    {translateMedidasSimbolos(m.item.unidad)}
                                </td>
                                <td className="p-1 text-center w-20">
                                    {isAromatizante ? (
                                        <Checkbox
                                            checked={parseFloat(m.cantidad) > 0}
                                            disabled
                                            size="small"
                                            sx={{
                                                color: "#0054a6",
                                                "&.Mui-checked": {
                                                    color: "#0054a6",
                                                },
                                            }}
                                        />
                                    ) : (
                                        <span>
                                            {parseFloat(m.cantidad) === 0 ? "----" : m.cantidad}
                                        </span>
                                    )}
                                </td>
                                {isSpecialCategory && (
                                    <>
                                        <td className="p-1 text-right w-24">
                                            {parseFloat(m.volDesechos || "0") === 0
                                                ? "----"
                                                : parseFloat(m.volDesechos || "0").toFixed(1)}
                                        </td>
                                        <td className="p-1 text-right w-20">{m.nViajes || 0}</td>
                                        <td className="p-1 text-right w-20">
                                            {parseFloat(m.nHoras || "0") === 0
                                                ? "----"
                                                : parseFloat(m.nHoras || "0").toFixed(1)}
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                    <tr
                        className="bg-gray-100 font-semibold text-azul print:bg-gray-200 print:text-black"
                    >
                        <td></td>
                        <td colSpan={2} className="p-1">
                        Total - {categoria}
                        </td>
                        <td className="p-1 text-right">{totalCategoria.toFixed(1)}</td>
                        {isSpecialCategory && (
                        <>
                            <td colSpan={3}></td>
                        </>
                        )}
                    </tr>
                    </tbody>
                </table>
                </div>
            );
            })}


            </div>

            {/* Evidencias */}
            <h3
            className="text-lg font-semibold text-azul mb-2 print:text-sm print:mb-1"
            >
            Evidencias
            </h3>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 print:grid-cols-2 print:gap-1 print-break-inside-avoid"
            >
            {manifest.photos.map((url, index) => (
                <div key={index} className="relative w-full h-64 print:h-32">
                <Image
                    fill
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    style={{ objectFit: "contain" }}
                    className="print:object-contain"
                />
                </div>
            ))}
            </div>

            {/* Firmas */}
            <h3
            className="text-lg font-semibold text-azul mb-2 print:text-sm print:mb-1"
            >
            Firmas
            </h3>
            <table
                className="w-full border border-gray-300 text-sm text-gray-700 print:text-[10px] print:border-black print-break-inside-avoid"
            >
            <tbody>
                <tr>
                    <td className="p-1 font-semibold border text-center bg-gray-100 w-1/2">
                        Firma Diligenciador
                    </td>
                    <td className="p-1 font-semibold border text-center bg-gray-100 w-1/2">
                        Firma Cliente
                    </td>
                </tr>
                <tr>

                    {/* Firma Diligenciador */}
                    <td className="p-1 border align-top print-break-inside-avoid">
                        <div className="w-full aspect-[3/1] relative mb-2 print:mb-1">
                        <Image
                            src={manifest.signature}
                            alt="Firma Conductor"
                            fill
                            className="print:object-contain"
                        />
                        </div>
                        <table className="w-full border border-gray-300 text-sm text-gray-700 mt-2 print:text-[10px] print:border-black">
                        <tbody>
                            <tr>
                            <td className="p-1 font-semibold border w-40 bg-gray-100">
                                Nombre
                            </td>
                            <td className="p-1 border">
                                {manifest.user?.name || "No registrado"}
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>

                    {/* Firma Cliente */}
                    <td className="p-1 border align-top">
                        <div className="w-full aspect-[3/1] relative mb-2 print:mb-1">
                        <Image
                            src={manifest.signatureClient}
                            alt="Firma Cliente"
                            fill
                            className="print:object-contain"
                        />
                        </div>
                        <table
                        className="w-full border border-gray-300 text-sm text-gray-700 mt-2 print:text-[10px] print:border-black"
                        >
                        <tbody>
                            <tr>
                            <td className="p-1 font-semibold border w-40 bg-gray-100">
                                Nombre
                            </td>
                            <td className="p-1 border">
                                {manifest.contactClient || "No registrado"}
                            </td>
                            </tr>
                            <tr>
                            <td className="p-1 font-semibold border w-40 bg-gray-100">
                                Cargo
                            </td>
                            <td className="p-1 border">
                                {manifest.positionClient || "No registrado"}
                            </td>
                            </tr>
                            <tr>
                            <td className="p-1 font-semibold border w-40 bg-gray-100">
                                Teléfono
                            </td>
                            <td className="p-1 border">
                                {manifest.phone || "No registrado"}
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>

                    
                </tr>
            </tbody>
            </table>
        </div>
    );
}

export default ManifiestViewById;
