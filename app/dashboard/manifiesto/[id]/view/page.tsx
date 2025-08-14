import ManifiestViewById from "@/src/components/dashboard/manifiesto/ManifiestViewById"

async function GetManifestById({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params

    return <ManifiestViewById id={id} />
}

export default GetManifestById
