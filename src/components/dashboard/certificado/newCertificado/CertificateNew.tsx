"use client";
import { getCertificateManifest } from "@/src/api/manifestApi";
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useMemo, useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CertificateFormSearch from "../CertificateFormSearch";
import ManifestCertificatePagination from "../ManifestCertificatePagination";
import ManifestCertificateTable from "../ManifestCertificateTable";
import CertificateNewForm from "./CertificateNewForm";
import { useForm } from "react-hook-form";
import { NewCertificateType } from "@/src/types";

import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify"; // 👈 asegúrate de tener react-toastify instalado
import { createCertificate } from "@/src/api/certificateApi";

export type selectedManifestCertificate = {
    id: number;
};

type CertificateNewProps = {
    page: number;
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<{
    total: number;
    totalPages: number;
    currentPage: number;
    certificates: {
        No: string;
        certificateType: "CERTIFICADO DE GESTIÓN INTEGRAL DE RESIDUOS";
        id: number;
        createdAt: string;
        cliente: {
            id: number;
            identificacionType: "cc" | "ti" | "ce" | "nit" | "rc" | "pa" | "pep" | "diplomatico" | "sinIdentificacion";
            name: string;
            alias: string;
            identificacion: string;
        };
    }[];
} | undefined, Error>>
};

function CertificateNew({ page, refetch}: CertificateNewProps) {
    const limit = 10;

    const [code, setCode] = useState<string>("");
    const [clientId, setClientId] = useState<string>(""); 
    const [selected, setSelected] = useState<selectedManifestCertificate[]>([]);

    const initialValues: NewCertificateType = {
        certificateType: "CERTIFICADO DE GESTIÓN INTEGRAL DE RESIDUOS",
        clientId: "",
        manifestIds: [],
        No: "",
    };

    const {
        register,
        formState: { errors },
        setValue,
        handleSubmit,
        reset
    } = useForm<NewCertificateType>({
        defaultValues: initialValues,
    });


    useEffect(() => {
        setValue("clientId", clientId);
    }, [clientId, setValue]);

    useEffect(() => {
        setValue(
            "manifestIds",
            selected.map((s) => s.id)
        );
    }, [selected, setValue]);

    const { mutate, isPending } = useMutation({
        mutationFn: createCertificate,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess(data) {
            toast.success('Certificado creado correcatmente')
             // 👇 reiniciar todo
            setSelected([]);
            setClientId("");
            setCode("");
            reset(initialValues);
            refetch()
        }
    })

    const handleCreateCertificate = (formData: NewCertificateType) => {

        if (!formData.clientId) {
            toast.error("Debe seleccionar un cliente.");
            return;
        }
        if (!formData.manifestIds || formData.manifestIds.length === 0) {
            toast.error("Debe seleccionar al menos un manifiesto.");
            return;
        }
        if (!formData.No) {
            toast.error("Debe ingresa el Número de Certificado.");
            return;
        }
        if (!formData.certificateType) {
            toast.error("Debe seleccionar el tipod de certifizado.");
            return;
        }

        mutate({formData})
    };

    const handleToggleManifest = (manifestId: number) => {
        setSelected((prev) => {
            const manifestIndex = prev.findIndex((m) => m.id === manifestId);

            if (manifestIndex === -1) {
                return [...prev, { id: manifestId }];
            }
            return prev.filter((m) => m.id !== manifestId);
        });
    };

    const handleToggleManifests = (manifestIds: number[]) => {
        setSelected((prev) => {
            const allSelected = manifestIds.every((id) =>
                prev.some((m) => m.id === id)
            );

            if (allSelected) {
                return prev.filter((m) => !manifestIds.includes(m.id));
            } else {
                const toAdd = manifestIds
                    .filter((id) => !prev.some((m) => m.id === id))
                    .map((id) => ({ id }));

                return [...prev, ...toAdd];
            }
        });
    };

    const debouncedSetCode = useMemo(
        () =>
            debounce((value: string) => {
                setCode(value);
            }, 1500),
        []
    );

    const { data, isLoading } = useQuery({
        queryKey: ["manifestCertificate", page, limit, code, clientId],
        queryFn: () => getCertificateManifest({ code, clientId, limit, page }),
        enabled: !!code && !!clientId,
    });

    return (
        <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p className="font-bold text-azul text-lg">Nuevo Certificado</p>
            </AccordionSummary>

            <AccordionDetails>
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Typography
                        variant="body1"
                        className="text-gray-700 leading-relaxed"
                    >
                        Busca{" "}
                        <span className="font-semibold text-azul">
                            servicios o manifiestos
                        </span>{" "}
                        filtrando por{" "}
                        <span className="font-semibold">cliente</span> y/o{" "}
                        <span className="font-semibold">
                            código de facturación
                        </span>
                        . Agrúpalos y selecciona el tipo de certificado que
                        deseas generar.
                    </Typography>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-3">
                    <CertificateFormSearch
                        onSearchChange={debouncedSetCode}
                        clientId={clientId}
                        setClientId={setClientId}
                    />
                </div>

                {isLoading && (
                    <h2 className="text-azul text-xl text-center font-black mt-10">
                        Cargando Datos...
                    </h2>
                )}

                {!isLoading && data?.manifests.length === 0 && (
                    <h2 className="text-azul text-xl text-center font-black mt-10">
                        No Hay Resultados
                    </h2>
                )}

                {selected.length > 0 && clientId && (
                    <form
                        className="space-y-1"
                        onSubmit={handleSubmit(handleCreateCertificate)}
                    >
                        <CertificateNewForm
                            register={register}
                            errors={errors}
                        />

                        <div className="w-full overflow-x-auto py-5 flex flex-col gap-2">
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                disabled={isPending}
                                type="submit"
                                startIcon={<SaveIcon />}
                            >
                                Crear Certificado
                            </Button>
                        </div>
                    </form>
                )}

                {data && data.manifests.length > 0 && (
                    <ManifestCertificateTable
                        manifests={data.manifests}
                        onToggleManifest={handleToggleManifest}
                        onToggleManifests={handleToggleManifests}
                        selected={selected}
                    />
                )}

                {data && (
                    <ManifestCertificatePagination
                        page={data.currentPage}
                        totalPages={data.totalPages}
                    />
                )}
            </AccordionDetails>
        </Accordion>
    );
}

export default CertificateNew;
