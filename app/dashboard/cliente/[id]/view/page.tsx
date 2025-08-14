import ClienteViewById from "@/src/components/dashboard/cliente/viewCliente/ClienteViewById"

async function ClienteView({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <ClienteViewById id={id} />
}

export default ClienteView
