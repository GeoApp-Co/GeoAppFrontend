import DashboardUser from "@/src/components/dashboard/usuario/DashboardUser";
import { redirect } from "next/navigation";

async function UserPage({
    searchParams,
}: {
    searchParams: Promise<{ page: string }>;
}) {
    const params = await searchParams;
    const page = +params.page || 1;

    if (page < 1) redirect("/dashboard/usuario?page=1");

    return <DashboardUser page={page} />;
}

export default UserPage;
