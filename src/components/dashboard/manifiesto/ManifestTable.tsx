"use client"
import { useAuth } from "@/src/hooks/useAuth";
import { ManifestType } from "@/src/types";
import { formatDateTimeLarge, formatNumber } from "@/src/utils";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";

type ManifestTableProps = {
    manifests: ManifestType[];
};

function ManifestTable({ manifests }: ManifestTableProps) {
    const router = useRouter();
    const { user } = useAuth()

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5">
            <table className="min-w-full bg-white table-fixed">
                <thead className="bg-azul text-white text-sm">
                    <tr>
                        <th className="p-3 text-left font-semibold w-[60px]">#</th>
                        <th className="p-3 text-left font-semibold min-w-[120px]">Cliente</th>
                        <th className="p-3 text-left font-semibold hidden sm:table-cell min-w-[120px]">Nit/CC</th>
                        <th className="p-3 text-left font-semibold min-w-[120px]">Fecha</th>
                        <th className="p-3 text-left font-semibold w-full max-w-[300px]">Plantilla</th>
                        <th className="p-3 font-semibold hidden lg:table-cell text-center w-[100px]">Factura</th>
                        <th className="p-3 text-left font-semibold min-w-[140px]">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {manifests.map((manifest, index) => (
                        <tr
                            key={manifest.id}
                            className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 text-sm`}
                        >
                            <td className="p-3">{formatNumber(manifest.id)}</td>
                            <td className="p-3 truncate max-w-[180px]">{manifest.cliente.alias}</td>
                            <td className="p-3 hidden sm:table-cell">{manifest.cliente.identificacion}</td>
                            <td className="p-3">{formatDateTimeLarge(manifest.date)}</td>
                            <td className="p-3 max-w-[300px] whitespace-normal break-words">
                            {manifest.manifestTemplate.name}
                            </td>
                            <td className="p-3 hidden lg:table-cell text-center">
                                {manifest.isInvoiced ? (
                                    <FaCheck className="text-green-500 inline-block" />
                                ) : (
                                    <FaTimes className="text-red-500 inline-block" />
                                )}
                            </td>

                            <td className="p-3 flex flex-wrap gap-2">
                                <button
                                    onClick={() => router.push(`/dashboard/manifiesto/${manifest.id}/view`)}
                                    className="px-3 py-1 text-sm bg-azul text-white rounded hover:bg-blue-600"
                                >
                                    Ver
                                </button>

                                {user?.rol.name === 'operacion' && (
                                    <button
                                        onClick={() => router.push(`/dashboard/manifiesto/${manifest.id}/edit`)}
                                        className="px-3 py-1 text-sm bg-verde text-white rounded hover:bg-yellow-600"
                                    >
                                        Editar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManifestTable;
