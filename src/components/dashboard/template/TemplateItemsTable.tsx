import { GroupedItemsForm, ItemType } from "@/src/types";
import { translateMedidasSimbolos } from "@/src/utils";
import { useMemo } from "react";

type TemplateItemsTableProps = {
    items: ItemType[]
    handleRemoveItem?: (itemId: number) => void
}

function TemplateItemsTable( { items, handleRemoveItem } : TemplateItemsTableProps) {

    const groupedItems = useMemo(() => {
        if (!items) return {};
        return items.reduce<GroupedItemsForm>((acc, item) => {
            const categoria = item.categoria || 'OTRO';
            if (!acc[categoria]) acc[categoria] = [];
            acc[categoria].push(item);
            return acc;
        }, {});
    }, [items]);

    return (
        <div className="w-full text-sm text-left">
            {Object.entries(groupedItems).map(([categoria, items]) => (
                <div key={categoria} className="mb-6">
                    <h4 className="text-md text-center font-semibold text-white p-2 bg-azul">{categoria}</h4>
                    
                    <table className="w-full table-fixed text-sm text-left border border-gray-200 rounded-md">
                        <thead className="bg-azul text-white">
                            <tr>
                                <th className="p-2 w-20">Código</th>
                                <th className="p-2">Nombre</th>
                                <th className="p-2 w-20">Unidad</th>
                                {handleRemoveItem && <th className="p-2 w-24">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((m, index) => (
                                <tr
                                    key={m.id}
                                    className={`border-b ${
                                        index % 2 === 0 ? "bg-white" : "bg-blue-50"
                                    } hover:bg-blue-100 border-t`}
                                >
                                    <td className="p-2 w-20">{m.code}</td>
                                    <td className="p-2 truncate uppercase">{m.name}</td>
                                    <td className="p-2 w-20">{translateMedidasSimbolos(m.unidad)}</td>
                                    {handleRemoveItem && (
                                        <td className="p-2 w-24">
                                            <button
                                                onClick={() => handleRemoveItem(m.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default TemplateItemsTable;
