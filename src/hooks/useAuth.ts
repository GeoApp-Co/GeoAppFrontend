
import { useQuery } from "@tanstack/react-query"
import { getUser } from "../api/authApi"
import { useEffect, useState } from "react"


export const useAuth = () => {

    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('AUTH_TOKEN')
        setToken(storedToken)
    }, [])


    const {data: user, isError, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: !!token,
        retry: 2,
        refetchOnWindowFocus: false 
    })

    return {
        user,
        isError,
        isLoading,
        token
    }
}