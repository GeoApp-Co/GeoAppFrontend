"use client";
import { getManifestById } from "@/src/api/manifestApi";
import GoBackButtonMUI from "@/src/UI/GoBackButtonMUI";
import LoaderPage from "@/src/UI/loaders/LoaderPage";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ManifiestViewById from "./ManifiestViewById";

export default function PrintableManifest({ id }: { id: string }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const { data, isLoading } = useQuery({
        queryKey: ["manifiest", id],
        queryFn: () => getManifestById({ manifestId: id }),
        enabled: !!id,
    });

    if (isLoading) return <LoaderPage />;
    if (!data && !isLoading) notFound();

    return (
        <>
        <div className="max-w-5xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-md space-y-6 print:max-w-full print:shadow-none print:rounded-none print:p-2 print:space-y-2 print:text-[11px]">
            <div className="flex flex-col gap-3 lg:flex-row md:justify-between items-center mb-2">
            {/* Botón Imprimir */}
            <button
                onClick={reactToPrintFn}
                className="bg-azul text-white px-4 py-2 rounded"
            >
                Imprimir / Descargar Manifiesto
            </button>

            <GoBackButtonMUI />
            </div>
        </div>

        {/* Contenido imprimible */}
        <div ref={contentRef}>{data && <ManifiestViewById manifest={data} />}</div>
        </>
    );
}
