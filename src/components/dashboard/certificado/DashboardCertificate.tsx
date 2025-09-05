"use client";
import { useQuery } from "@tanstack/react-query";
import CertificateNew from "./newCertificado/CertificateNew";
import { getCertificates } from "@/src/api/certificateApi";
import Heading from "@/src/UI/Heading";
import CertificateTable from "./CertificateTable";

type DashboardCertificateProps = {
    page: number;
    pageManifest: number;
};

function DashboardCertificate({ page, pageManifest }: DashboardCertificateProps) {
    const limit = 10

    const { data, isLoading, refetch} = useQuery({
        queryKey: ['certificates', page, limit],
        queryFn: () => getCertificates({page, limit, })
    })

    return (
        <>

            <Heading>Lista de Certificados</Heading>

            <CertificateNew page={pageManifest} refetch={refetch}/>


            {isLoading && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    Cargando Datos...
                </h2>
            )}

            {!isLoading && data?.certificates.length === 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}

            {data && data.certificates.length > 0 && (
                <CertificateTable
                    certificates={data.certificates}
                />
            )}


        </>
    )
    
}

export default DashboardCertificate;
