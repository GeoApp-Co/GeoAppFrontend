"use client"
import { getDisposicionFinalLicencias, getDisposicionFinals, getDisposicionFinalSitios } from "@/src/api/disposicionFinalApi";
import Heading from "@/src/UI/Heading";
import { useQueries } from "@tanstack/react-query";
import { AccordionSection } from "./AccordionSection";
import DisposicionFinalTable from "./DisposicionFinalTable";
import LicenciasTable from "./LicenciasTable";
import SitiosTable from "./SitiosTable";

// type DashboardFinalDisposalProps = {
//     page: number
// }

function DashboardFinalDisposal() {

    const results = useQueries({
        queries: [
            { queryKey: ["disposicionFinalSitios"], queryFn: getDisposicionFinalSitios },
            { queryKey: ["disposicionFinalLicencias"], queryFn: getDisposicionFinalLicencias },
            { queryKey: ["disposicionFinals"], queryFn: getDisposicionFinals },
        ]
    });

    // Desestructuración de resultados
    const { data: sitios, isLoading: isLoadingSitios } = results[0];
    const { data: licencias, isLoading: isLoadingLicencias } = results[1];
    const { data: combinaciones, isLoading: isLoadingCombinaciones } = results[2];

    return (
        <section className="bg-white p-3 h-full">
            <Heading>Sitios De Disposición Final</Heading>

            <AccordionSection title="Disposición final" expanded={true}>
                <DisposicionFinalTable loading={isLoadingCombinaciones} data={combinaciones} sitios={sitios?.sitios || []} licencias={licencias?.licencias || []} />
            </AccordionSection>

            <AccordionSection title="Sitios de disposición final">
                <SitiosTable loading={isLoadingSitios} data={sitios} />
            </AccordionSection>

            <AccordionSection title="Licencias de disposición final">
                <LicenciasTable loading={isLoadingLicencias} data={licencias} />
            </AccordionSection>
            
        </section>
    );
}

export default DashboardFinalDisposal
