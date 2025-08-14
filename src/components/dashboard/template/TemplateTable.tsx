import { useAuth } from "@/src/hooks/useAuth";
import { TemplateType } from "@/src/types";
import { formatNumber } from "@/src/utils";
import { useRouter } from "next/navigation";

type TemplateTableProps = {
    templates: TemplateType[];
};

function TemplateTable({ templates }: TemplateTableProps) {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5">
        <table className="min-w-full bg-white">
            <thead className="bg-azul text-white text-sm">
            <tr>
                {/* <th className="p-3 text-left font-semibold">#</th> */}
                <th className="p-3 text-left font-semibold min-w-[150px]">Código</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Nombre</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Acciones</th>
                
            </tr>
            </thead>
            <tbody>
            {templates.map((item, index) => (
                <tr
                    key={item.id}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 text-sm`}
                >
                <td className="p-3 max-w-[180px]">#{formatNumber(item.id)}</td>
                <td className="p-3 truncate max-w-[180px]">{item.name}</td>
                <td className="p-3 flex flex-wrap gap-2">
                    <button
                        onClick={() => router.push(`/dashboard/plantilla/${item.id}/view`)}
                        className="px-3 py-1 text-sm bg-azul text-white rounded hover:bg-blue-600"
                        >
                    Ver
                    </button>
                    {user?.rol.name === "admin" && (
                    <>
                    <button
                        onClick={() => router.push(`/dashboard/plantilla/${item.id}/edit`)}
                        className="px-3 py-1 text-sm bg-verde text-white rounded hover:bg-yellow-600"
                    >
                        Editar
                    </button>
                    </>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default TemplateTable
