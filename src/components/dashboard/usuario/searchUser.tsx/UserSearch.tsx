'use client'
import { getUsers } from '@/src/api/userApi'
import GoBackButton from '@/src/UI/GoBackButton'
import Heading from '@/src/UI/Heading'
import { useQuery } from '@tanstack/react-query'
import UserPagination from '../UserPagination'
import UserTable from '../UserTable'
import UserSearchForm from './UserSearchForm'

export default function UserSearch({ page, search }: { page: number, search: string}) {
    const limit = 10

    const { data, isLoading} = useQuery({
        queryKey: ['users', page, limit, search],
        queryFn: () => getUsers({ page, limit, search}),
    })


    return (
        <>
            <Heading>Resultados de búsqueda: {search}</Heading>

            <div className="flex gap-3 items-center justify-between">
                <GoBackButton/>

                <UserSearchForm/>
            </div>

            {isLoading && 
                <h2 className='text-azul text-xl text-center font-black mt-10'> Cargando Datos...</h2>
            }

            {!isLoading && data?.users.length == 0 && (
                <h2 className="text-azul text-xl text-center font-black mt-10">
                    No Hay Resultados
                </h2>
            )}
            

            {data && data.users.length > 0  &&
                <UserTable users={data.users}/>
            } 

            {data && 
                <UserPagination 
                    page={data.currentPage}
                    totalPages={data.totalPages}
                />
            }

        </>
    )
}