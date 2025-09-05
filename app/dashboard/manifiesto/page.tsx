

import DashboardManifest from "@/src/components/dashboard/manifiesto/DashboardManifest"
import { redirect } from "next/navigation"

async function DashboardPage({searchParams} : {searchParams: Promise<{ page: string}>}) {

    const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/manifiesto?page=1")


    return <DashboardManifest page={page} />

}

export default DashboardPage



