import { ClienteCellType } from "@/src/types";
import { translateIdentificacionTypeShort, translatePersonaType } from "@/src/utils";
import { useRouter } from "next/navigation";

type ClientsTableProps = {
    clients: ClienteCellType[];
};

function ClientsTable({ clients }: ClientsTableProps) {
    const router = useRouter();

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5">
        <table className="min-w-full bg-white">
            <thead className="bg-azul text-white text-sm">
            <tr>
                {/* <th className="p-3 text-left font-semibold">#</th> */}
                <th className="p-3 text-left font-semibold min-w-[150px]">Cliente</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Alias</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Tipo de Persona</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Identificación</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Acciones</th>
                
            </tr>
            </thead>
            <tbody>
            {clients.map((cliente, index) => (
                <tr
                    key={cliente.id}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 text-sm`}
                >
                <td className="p-3 max-w-[180px]">{cliente.name}</td>
                <td className="p-3 truncate max-w-[180px]">{cliente.alias}</td>
                <td className="p-3 truncate max-w-[180px]">
                    {translatePersonaType(cliente.personaType)}
                </td>

                {/* Tipo de doc corto + número */}
                <td className="p-3 hidden sm:table-cell">
                    {translateIdentificacionTypeShort(
                        cliente.identificacionType
                    )}{" "}
                    {cliente.identificacion}
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                    <button
                        onClick={() => router.push(`/dashboard/cliente/${cliente.id}/view`)}
                        className="px-3 py-1 text-sm bg-azul text-white rounded hover:bg-blue-600"
                    >
                        Ver
                    </button>
                    
                    <>
                    <button
                        onClick={() => router.push(`/dashboard/cliente/${cliente.id}/edit`)}
                        className="px-3 py-1 text-sm bg-verde text-white rounded hover:bg-yellow-600"
                    >
                        Editar
                    </button>
                    </>
                    
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default ClientsTable
