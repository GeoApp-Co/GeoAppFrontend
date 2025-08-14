import ClienteSearch from "@/src/components/dashboard/cliente/searchCliente/ClienteSearch"
import { redirect } from "next/navigation"

async function SearchPage({searchParams}: { searchParams: Promise<{ search: string, page: string}> }) {

    const { search} = await searchParams
    const params = await searchParams
    const page = +params.page || 1
    
    if (page < 1) redirect(`/dashboard/cliente/search?search=${search}&page=1`)

    return <ClienteSearch 
            page={page} 
            search={search} 
        />
    }
    
export default SearchPage
