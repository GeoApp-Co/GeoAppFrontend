import ManifestEdit from "@/src/components/dashboard/manifiesto/editManifiesto/ManifestEdit"


async function ManifestEditView({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <ManifestEdit id={id} />
}

export default ManifestEditView
