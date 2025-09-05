import DashboardCommercialManifesto from "@/src/components/dashboard/manifiesto-comercial/DashboardCommercialManifesto"
import { redirect } from "next/navigation"

async function CommercialManifesto({searchParams} : {searchParams: Promise<{ page: string}>}) {
    const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/manifiesto-comercial?page=1")


    return <DashboardCommercialManifesto page={page} />
}

export default CommercialManifesto
