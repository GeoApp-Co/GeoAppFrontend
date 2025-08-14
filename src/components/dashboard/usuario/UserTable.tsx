import { UserType } from "@/src/types";
import { traslateRoles } from "@/src/utils";
import { useRouter } from "next/navigation";

type UserTableProps = {
    users: UserType[];
};

function UserTable({ users }: UserTableProps) {
    const router = useRouter();

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5">
        <table className="min-w-full bg-white">
            <thead className="bg-azul text-white text-sm">
            <tr>
                {/* <th className="p-3 text-left font-semibold">#</th> */}
                <th className="p-3 text-left font-semibold min-w-[150px]">Identificación</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Nombre</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Rol</th>
                <th className="p-3 text-left font-semibold min-w-[120px]">Acciones</th>
                
            </tr>
            </thead>
            <tbody>
            {users.map((user, index) => (
                <tr
                    key={user.id}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 text-sm`}
                >
                <td className="p-3 max-w-[180px]">{user.cc}</td>
                <td className="p-3 truncate max-w-[180px]">{user.name}</td>
                <td className="p-3 truncate max-w-[180px]">{traslateRoles(user.rol.name)}</td>
                <td className="p-3 flex flex-wrap gap-2">
                    {/* <button
                        onClick={() => router.push(`/dashboard/plantilla/${user.id}/view`)}
                        className="px-3 py-1 text-sm bg-azul text-white rounded hover:bg-blue-600"
                        >
                    Ver
                    </button> */}
                    
                    
                    <button
                        onClick={() => router.push(`/dashboard/usuario/${user.id}/edit`)}
                        className="px-3 py-1 text-sm bg-verde text-white rounded hover:bg-yellow-600"
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

export default UserTable
