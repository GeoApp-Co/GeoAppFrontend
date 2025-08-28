import { TemplateType } from "@/src/types";
import { formatNumber } from "@/src/utils";
import { useRouter } from "next/navigation";

type TemplateTableProps = {
    templates: TemplateType[];
};

function TemplateTable({ templates }: TemplateTableProps) {
    const router = useRouter();

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5">
            <table className="min-w-full bg-white">
                <thead className="bg-azul text-white text-sm">
                    <tr>
                        <th className="p-2 text-left font-semibold w-[80px]">Código</th>
                        <th className="p-2 text-left font-semibold min-w-[180px]">Nombre</th>
                        <th className="p-2 text-right font-semibold w-[120px]">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 text-sm`}
                        >
                            <td className="p-2 text-xs">#{formatNumber(item.id)}</td>
                            <td className="p-2 truncate">{item.name}</td>
                            <td className="p-2 text-right">
                                <div className="flex justify-end gap-2 flex-wrap">
                                    <button
                                        onClick={() => router.push(`/dashboard/plantilla/${item.id}/view`)}
                                        className="px-2 py-1 text-xs bg-azul text-white rounded hover:bg-blue-600"
                                    >
                                        Ver
                                    </button>
                                    
                                    <button
                                        onClick={() => router.push(`/dashboard/plantilla/${item.id}/edit`)}
                                        className="px-2 py-1 text-xs bg-verde text-white rounded hover:bg-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default TemplateTable
