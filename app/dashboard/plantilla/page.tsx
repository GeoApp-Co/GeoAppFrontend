import DashboadTemplate from "@/src/components/dashboard/template/DashboardTemplete"
import { redirect } from "next/navigation"

async function PlantillaPage({searchParams} : {searchParams: Promise<{ page: string}>}) {

    const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/plantilla?page=1")


    return <DashboadTemplate page={page} />
}

export default PlantillaPage
