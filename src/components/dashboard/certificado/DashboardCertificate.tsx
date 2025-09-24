"use client";
import { getCertificateManifest } from "@/src/api/manifestApi";
import { ManifestInvoiceSearchFormData } from "@/src/types";
import Heading from "@/src/UI/Heading";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CertificateNew from "./newCertificado/CertificateNew";
import { getCertificatesFull } from "@/src/api/certificateApi";
import CertificateTable from "./CertificateTable";

type DashboardCertificateProps = {
    page: number;
};

export type SelectedManifestItems = {
    clientId: number;
    itemIds: { manifestItemId: number }[];
}


function DashboardCertificate({ page: pageCertificate }: DashboardCertificateProps) {
    // page base 0 para sincronizar con backend
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [filters, setFilters] = useState<ManifestInvoiceSearchFormData>({
        clientId: '',
        fechaMes: null,
        item: '',
        location: '',
        manifestId: '',
        manifestTemplate: '',
        invoiceCode: '',
        quotationCode: '',
        isInvoiced: ''
    });

    // Estado para selección de items
    const [selectedState, setSelectedState] = useState<SelectedManifestItems>({
        clientId: 0,
        itemIds: []
    });

    const selectItem = (manifestItemId: number) => {
        setSelectedState(prev => {
            const clientId = prev.clientId;
            const items = [...prev.itemIds];
            if (prev.itemIds.some(item => item.manifestItemId === manifestItemId)) {
                return {
                    ...prev,
                    clientId: clientId,
                    itemIds: items.filter(item => item.manifestItemId !== manifestItemId)
                };
            }
            return {
                ...prev,
                clientId: clientId,
                itemIds: [...prev.itemIds, { manifestItemId }]
            };
        });
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0); // reset a la primera página (base 0)
    };

    const { data: manifestCertificateData, isLoading } = useQuery({
        queryKey: ["manifestCertificate", page, limit, filters],
        queryFn: () => getCertificateManifest({ ...filters, limit, page }),
        enabled: !!filters.clientId && filters.clientId.trim() !== '',
    });

    const { data: certificatesData, isLoading: isLoadingCertificates } = useQuery({
        queryKey: ['certificates', pageCertificate, limit],
        queryFn: () => getCertificatesFull({ page: pageCertificate, limit }),
    })

    useEffect(() => {
        setSelectedState(() => ({
            clientId: filters.clientId ? Number(filters.clientId) : 0,
            itemIds: []
        }));
    }, [filters.clientId]);

    return (
        <section className="bg-white p-3 space-y-3">
            <Heading>Área de Certificados</Heading>
            <CertificateNew
                data={manifestCertificateData}
                isLoading={isLoading}
                setFilters={setFilters}
                selectedState={selectedState}
                selectItem={selectItem}
                page={page}
                limit={limit}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

            {certificatesData && certificatesData.certificates.length === 0 && (
                <p className="text-center text-lg text-gray-600">No hay certificados disponibles.</p>
            )}

            {isLoadingCertificates && <p className="text-center text-lg text-gray-600">Cargando certificados...</p>}

            <Heading>Certificados Generados</Heading>
            {certificatesData &&
                <CertificateTable
                    certificates={certificatesData.certificates}
                    page={pageCertificate}
                    totalPages={certificatesData.totalPages}
                />
            }
        </section>
    );
}

export default DashboardCertificate;
