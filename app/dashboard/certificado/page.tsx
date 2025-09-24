import DashboardCertificate from "@/src/components/dashboard/certificado/DashboardCertificate"
import { redirect } from "next/navigation"

async function certificateView({searchParams} : {searchParams: Promise<{ page: string}>}) {
    const params = await searchParams
    const page = +params.page || 1
    
    if (page < 1) redirect("/dashboard/certificado?page=1")

    return <DashboardCertificate 
        page={page}
    />
}

export default certificateView
