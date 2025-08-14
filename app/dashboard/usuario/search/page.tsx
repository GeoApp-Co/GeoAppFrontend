import UserSearch from "@/src/components/dashboard/usuario/searchUser.tsx/UserSearch"
import { redirect } from "next/navigation"

async function SearchPage({searchParams}: { searchParams: Promise<{ search: string, page: string}> }) {

    const { search} = await searchParams
    const params = await searchParams
    const page = +params.page || 1
    
    if (page < 1) redirect(`/dashboard/usuario/search?search=${search}&page=1`)

    return <UserSearch
            page={page} 
            search={search} 
        />
    }
    
export default SearchPage
