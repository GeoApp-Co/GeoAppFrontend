import { ItemType } from "@/src/types";

type TemplateItemsTableProps = {
    items: ItemType[]
    handleRemoveItem?: (itemId: number) => void
}

function TemplateItemsTable( { items, handleRemoveItem } : TemplateItemsTableProps) {
    return (
        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
        <thead className="bg-azul text-white">
            <tr>
            <th className="p-2">Código</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Unidad</th>
            {handleRemoveItem &&
                <th className="p-2">Unidad</th>
            }
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
                <td className="p-2">{m.code}</td>
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.unidad}</td>
                {handleRemoveItem && (
                    <td className="p-2">
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
    );
}

export default TemplateItemsTable;
