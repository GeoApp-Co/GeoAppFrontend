import TemplateViewById from "@/src/components/dashboard/template/viewTemplate/TemplateViewById"

async function ClienteView({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <TemplateViewById id={id} />
}

export default ClienteView
