"use client"
import { getTemplateById } from "@/src/api/templateApi";
import Divider from "@/src/UI/Divider";
import GoBackButton from "@/src/UI/GoBackButton";
import LoaderPage from "@/src/UI/loaders/LoaderPage";
import { formatNumber } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import TemplateItemsTable from "../TemplateItemsTable";

type TemplateViewByIdProps = {
    id: string;
};
function TemplateViewById({ id }: TemplateViewByIdProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["template", id],
        queryFn: () => getTemplateById({ templateId: id }),
        enabled: !!id,
    });
    if (isLoading) return <LoaderPage />;

    if (!data && !isLoading) {
        notFound();
    }
    
    if (data)
        return (
    <div className="max-w-4xl mx-auto mt-10 p-3 bg-white shadow-lg rounded-md space-y-1">
        <div className="flex flex-col gap-3 lg:flex-row md:justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-azul">
                        Plantilla de Manifiesto:{" "}
                        <span className="font-semibold text-gray-800">#{formatNumber(data?.id)}</span>
                    </h2>
                    <GoBackButton />
        </div>

                <Divider />

                <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Nombre de la Plantilla</h3>
                    <p className="text-gray-700">{data.name}</p>
                </div>


                <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Items de la Plantilla</h3>
                    <TemplateItemsTable items={data.items} />
        </div>

        </div>
    );
}

export default TemplateViewById;

