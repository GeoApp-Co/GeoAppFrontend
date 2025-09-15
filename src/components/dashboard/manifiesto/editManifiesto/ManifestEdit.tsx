"use client";
import { getManifestById, updateManifest } from "@/src/api/manifestApi";
import { UpdateManifestFormType } from "@/src/types";
import GoBackButton from "@/src/UI/GoBackButton";
import LoaderPage from "@/src/UI/loaders/LoaderPage";
import { formatDateTimeLarge, formatNumber } from "@/src/utils";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Divider } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ClientCard from "../ClientCard";
import TemplateComboBox from "../newManifiesto/TemplateComboBox";

type ManifestEditProps = {
    id: string;
};

function ManifestEdit({ id }: ManifestEditProps) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ["manifest", id],
        queryFn: () => getManifestById({ manifestId: id }),
        enabled: !!id,
    });

    const manifestTemplate = useMemo(() => {
        if (!data?.manifestTemplate?.id) return undefined;

        return {
        id: data.manifestTemplate.id,
        name: data.manifestTemplate.name,
        items: data.manifestItems.map(({ item }) => item),
        };
    }, [data]);

    const methods = useForm<UpdateManifestFormType>({
        defaultValues: {
        manifestTemplateId: data?.manifestTemplate.id,
        items: [],
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: updateManifest,
        onError(error) {
        toast.error(error.message);
        },
        onSuccess(data) {
        toast.success(data);
        queryClient.invalidateQueries({ queryKey: ["manifests"] });
        queryClient.invalidateQueries({ queryKey: ["manifest", id] });
        router.push("/dashboard/manifiesto");
        },
    });

    const handleUpdateManifest = methods.handleSubmit((formData) => {
        mutate({ manifestId: id, updateManifestformData: formData });
    });

    useEffect(() => {
        if (data?.manifestTemplate?.id) {
            methods.reset({
                manifestTemplateId: data.manifestTemplate.id,
                items: data.manifestItems.map(({ item, cantidad, nHoras, nViajes, volDesechos}) => ({
                    itemId: item.id,
                    cantidad: parseFloat(cantidad),
                    nHoras:  parseFloat(nHoras ?? '0'),
                    nViajes: nViajes ?? 0,
                    volDesechos: parseFloat(volDesechos ?? '0')
                })),
            });
        }
    }, [data, methods]);

    if (isLoading) return <LoaderPage />;

    if (data)
        return (
        <div className="max-w-4xl mx-auto mt-10 p-3 bg-white shadow-lg rounded-md space-y-1">
            <div className="flex flex-col gap-3 lg:flex-row md:justify-between items-center mb-2">
            <h2 className="text-2xl  font-bold text-azul">
                Manifiesto{" "}
                <span className="font-semibold">#{formatNumber(data?.id)}</span>{" "}
            </h2>

            <GoBackButton />
            </div>

            <Divider />

            <Disclosure as="div" className="">
            <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="py-2 text-left w-full font-medium text-azul">
                Datos del Cliente
                </span>
                <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                <ClientCard cliente={data.cliente} />
            </DisclosurePanel>
            </Disclosure>

            <Divider />

            <Disclosure as="div" className="">
            <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="py-2 text-left w-full font-medium text-azul">
                Datos del Manifiesto
                </span>
                <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-700">
                <div>
                    <strong>Plantilla:</strong> {data.manifestTemplate.name}
                </div>
                <div>
                    <strong>Lugar del Servicio:</strong> {data.location}
                </div>
                <div>
                    <strong>Fecha Inicial:</strong> {formatDateTimeLarge(data.date)}
                </div>
                <div>
                    <strong>Fecha Final:</strong>{" "}
                    {formatDateTimeLarge(data.dateFinal)}
                </div>
                <div>
                    <strong>Placa Del Vehículo:</strong> {data.car.plate} | {data.car.carType}
                </div>
                <div>
                    <strong>Observaciones:</strong> {data.observations || "Ninguna"}
                </div>
                </div>
            </DisclosurePanel>
            </Disclosure>

            <FormProvider {...methods}>
            <form
                onSubmit={handleUpdateManifest}
                className="flex flex-col gap-5 w-full mx-auto my-5"
            >
                {data && (
                <>
                    <TemplateComboBox manifestTemplate={manifestTemplate} />

                    <button
                        type="submit"
                        disabled={isPending}
                        className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde md:col-span-2 transition-colors ${
                            isPending
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-lime-200 hover:text-verde"
                        }`}
                        >
                        {isPending ? "Actualizando..." : "Actualizar Manifiesto"}
                    </button>
                </>
                )}
            </form>
            </FormProvider>
            <Divider />

            <div>
            <h2 className="text-lg font-semibold text-azul md:col-span-2">
                Evidencias
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {data.photos.map((url, index) => (
                <div key={index} className="relative w-full h-64">
                    <Image
                        fill
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        style={{ objectFit: "contain" }}
                    />
                </div>
                ))}
            </div>
            </div>

            <Divider />

            <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Cliente */}
                <div>
                <h3 className="text-lg font-medium mb-2 text-azul">
                    Firma del Contacto / Cliente
                </h3>
                <div className="border rounded w-full aspect-[3/1] mt-2 relative">
                    <Image src={data.signatureClient} alt="Firma Cliente" fill />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Nombre del contacto
                    </label>
                    <p className="bg-gray-100 px-4 py-2 rounded text-sm">
                    {data.contactClient || "No registrado"}
                    </p>
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Cargo del contacto
                    </label>
                    <p className="bg-gray-100 px-4 py-2 rounded text-sm">
                    {data.positionClient || "No registrado"}
                    </p>
                </div>
                </div>

                {/* Conductor */}
                <div>
                <h3 className="text-lg font-medium mb-2 text-azul">
                    Firma del Diligenciador
                </h3>
                <div className="border rounded w-full aspect-[3/1] mt-2 relative">
                    <Image src={data.signature} alt="Firma Conductor" fill />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Nombre del diligenciador
                    </label>
                    <p className="bg-gray-100 px-4 py-2 rounded text-sm">
                    {data.user?.name || "No registrado"}
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>
        );
}

export default ManifestEdit;
