import DashboardItem from "@/src/components/dashboard/item/DashboardItem"
import { redirect } from "next/navigation"

async function ItemPage({searchParams} : {searchParams: Promise<{ page: string}>}) {

    const params = await searchParams
    const page = +params.page || 1

    if (page < 1) redirect("/dashboard/item?page=1")


    return <DashboardItem page={page} />
}

export default ItemPage
