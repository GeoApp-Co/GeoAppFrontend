import CertificateById from "@/src/components/dashboard/certificado/viewCertificate/CertificateById"

async function CertificateViewPage({ params } : { params: Promise<{ id: string }> }) {

    const { id } = await params
    

    return <CertificateById id={id} />
}

export default CertificateViewPage
