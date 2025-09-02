import ManifestSearch from "@/src/components/dashboard/manifiesto/ManifestSearch"
import { redirect } from "next/navigation"

async function SearchPage({searchParams}: { searchParams: Promise<{ clientId: string, manifestTemplate: string,  page: string, estado: string, fecha: string}> }) {

    const { clientId, manifestTemplate, estado, fecha } = await searchParams
    const params = await searchParams
    const page = +params.page || 1
    
    if (page < 1) redirect(`/dashboard/manifiesto/search?search=${clientId}&page=1`)

    return <ManifestSearch 
        page={page} 
        clientId={clientId} 
        estado={estado}
        manifestTemplate={manifestTemplate}
        fecha={fecha}
        />
    }
    
export default SearchPage
    // "use client"
    // import { redirect, useSearchParams } from "next/navigation"
    // import ManifestSearch from "@/src/components/dashboard/manifiesto/ManifestSearch"
    
    // function SearchPage() {
    //     const searchParams = useSearchParams()
    
    //     const search = searchParams.get("search") || ""
    //     const estado = searchParams.get("estado") || ""
    //     const fecha = searchParams.get("fecha") || ""
    //     const page = Number(searchParams.get("page")) || 1
    
    //     if (page < 1) redirect(`/dashboard/manifiesto/search?search=${search}&page=1`)
    
    //     return (
    //         <ManifestSearch
    //         page={page}
    //         search={search}
    //         estado={estado}
    //         fecha={fecha}
    //         />
    //     )
    // }
    
    // export default SearchPage
