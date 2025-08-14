"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "./useAuth"
import { useEffect } from "react"

export const useCanAccessPage = (allowedRoles: string[]) => {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
        if (!user) router.replace('/auth/login')
        else if (!allowedRoles.includes(user.rol.name)) router.replace('/')
        }
    }, [user, isLoading, router, allowedRoles])

    return { isLoading }
}