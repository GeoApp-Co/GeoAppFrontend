import DashboardBillingManifesto from "@/src/components/dashboard/manifiesto-facturacion/DashboardBillingManifesto"
import { redirect } from "next/navigation"

async function BillingManifesto({searchParams} : {searchParams: Promise<{ page: string}>}) {
const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/manifiesto-facturacion?page=1")


    return <DashboardBillingManifesto page={page} />
}

export default BillingManifesto
