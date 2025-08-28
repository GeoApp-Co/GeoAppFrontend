import { useAuth } from "@/src/hooks/useAuth";
import { ItemType } from "@/src/types";
import { traslateMedidas } from "@/src/utils";
import { useRouter } from "next/navigation";

type ItemsTableProps = {
    items: ItemType[];
};

function ItemsTable({ items }: ItemsTableProps) {
    const router = useRouter();

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5">
            <table className="min-w-full bg-white">
                <thead className="bg-azul text-white text-sm">
                    <tr>
                        <th className="p-2 text-left font-semibold w-[80px]">Código</th>
                        <th className="p-2 text-left font-semibold min-w-[180px]">Nombre</th>
                        <th className="p-2 text-left font-semibold min-w-[100px]">Medida</th>
                        <th className="p-2 font-semibold w-[100px] text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 text-sm`}
                        >
                            <td className="p-2 text-xs">{item.code}</td>
                            <td className="p-2 truncate">{item.name}</td>
                            <td className="p-2">{traslateMedidas(item.unidad)}</td>
                            <td className="p-2 text-right">
                                <button
                                    onClick={() => router.push(`/dashboard/item/${item.id}/edit`)}
                                    className="px-2 py-1 text-xs bg-verde text-white rounded hover:bg-yellow-600"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default ItemsTable
