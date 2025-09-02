import ItemSearch from "@/src/components/dashboard/item/searchItem/ItemSearch"
import { redirect } from "next/navigation"

async function SearchPage({searchParams}: { searchParams: Promise<{ search: string, page: string, categoria: string}> }) {

    const { search, categoria} = await searchParams
    const params = await searchParams
    const page = +params.page || 1
    
    if (page < 1) redirect(`/dashboard/item/search?search=${search}&page=1`)

    return <ItemSearch
            page={page} 
            search={search} 
            categoria={categoria}
        />
    }
    
export default SearchPage
