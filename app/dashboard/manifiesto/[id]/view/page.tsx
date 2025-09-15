import PrintableManifest from "@/src/components/dashboard/manifiesto/PrintableManifest"

async function GetManifestById({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params
    

    return <PrintableManifest id={id} />
}

export default GetManifestById
