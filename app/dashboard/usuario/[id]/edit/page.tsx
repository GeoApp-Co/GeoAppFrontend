import UserEdit from "@/src/components/dashboard/usuario/editUser/UserEdit"

async function UserEditPage({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <UserEdit id={id} />
}

export default UserEditPage
