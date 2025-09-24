import DashboardFinalDisposalManifest from "@/src/components/dashboard/manifiesto-disposicion-final/DashboardFinalDisposalManifest"
import { redirect } from "next/navigation"

async function FinalDisposalManifestView({searchParams} : {searchParams: Promise<{ page: string}>}) {
    const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/manifiesto-disposicion-final?page=1")


    return <DashboardFinalDisposalManifest page={page} />
}

export default FinalDisposalManifestView
