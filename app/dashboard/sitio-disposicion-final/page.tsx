import DashboardFinalDisposal from "@/src/components/dashboard/sitio-disposicion-final/DashboardFinalDisposal"

async function FinalDisposalView(
    // {searchParams} : {searchParams: Promise<{ page: string}>}
) {
    // const params = await searchParams
    // const page = +params.page || 1

    // if (page < 1) redirect("/dashboard/sitio-disposicion-final?page=1")


    return <DashboardFinalDisposal 
        // page={page}
    />
}

export default FinalDisposalView
