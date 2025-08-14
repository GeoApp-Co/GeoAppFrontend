import { isAxiosError } from "axios"
import api from "../config/axios"
import { paginationUsersSchema, userSchema } from "../schemas"
import { NewUserFormType } from "../types"


type UserType = {
    search?: string,
    page: number
    limit: number
    formData: NewUserFormType
    userId: string
}

export async function getUsers( { search, page, limit} : Pick<UserType, 'search' | 'page' | 'limit'> ) {
    try {
        const url = '/users/all'
        const {data} = await api.get(url, {
            params: {
                search,
                page,
                limit
            }
        })


        const response = paginationUsersSchema.safeParse(data)

        // console.log(search);
        

        if (response.success) {
            return response.data
        }
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function createUser( { formData} : Pick<UserType, 'formData'> ) {
    try {
        const url = '/users'
        const {data} = await api.post<string>(url, formData)

        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getUserById( { userId } : Pick<UserType, 'userId'> ) {
    try {
        const url = `/users/${userId}`
        const {data} = await api.get(url)

        const response = userSchema.safeParse(data)

        if (response.success) {
            return response.data
        }
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateUser( { userId, formData } : Pick<UserType, 'userId' | 'formData'> ) {
    try {
        const url = `/users/${userId}`
        const {data} = await api.put<string>(url, formData)

        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}
