import { Skeleton } from "@mui/material";

type TemplateTableSkeletonProps = {
    rows?: number;
};

function TemplateTableSkeleton({ rows = 5 }: TemplateTableSkeletonProps) {
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
            {Array.from({ length: rows }).map((_, index) => (
                <tr
                key={index}
                className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                }`}
                >
                {/* Código */}
                <td className="p-2 text-xs">
                    <Skeleton variant="text" width={40} height={16} />
                </td>

                {/* Nombre */}
                <td className="p-2">
                    <Skeleton variant="text" width="70%" height={18} />
                </td>

                {/* Acciones */}
                <td className="p-2 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                    <Skeleton
                        variant="rectangular"
                        width={50}
                        height={24}
                        sx={{ borderRadius: "6px" }}
                    />
                    <Skeleton
                        variant="rectangular"
                        width={50}
                        height={24}
                        sx={{ borderRadius: "6px" }}
                    />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default TemplateTableSkeleton;
