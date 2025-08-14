import ClienteEdit from "@/src/components/dashboard/cliente/ediCliente/ClienteEdit"

async function ClienteEditPage({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <ClienteEdit id={id} />
}

export default ClienteEditPage
