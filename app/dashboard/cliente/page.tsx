import DashboardCliente from "@/src/components/dashboard/cliente/DashboardCliente"
import { redirect } from "next/navigation"

async function ClientePage({searchParams} : {searchParams: Promise<{ page: string}>}) {

    const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/cliente?page=1")


    return <DashboardCliente page={page} />
}

export default ClientePage
