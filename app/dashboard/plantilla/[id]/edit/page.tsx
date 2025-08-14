import TemplateEdit from "@/src/components/dashboard/template/editTemplate/TemplateEdit"

async function TemplateEditPage({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <TemplateEdit id={id} />
}

export default TemplateEditPage
