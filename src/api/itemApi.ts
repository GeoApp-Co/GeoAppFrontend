import { isAxiosError } from "axios"
import api from "../config/axios"
import { ItemSchema, paginatioItemsSchema } from "../schemas"
import { NewItemFormType } from "../types"

type ItemType = {
    search?: string,
    limit?: number, 
    page?: number,
    formData: NewItemFormType
    itemId: string
}

export async function getItems( { limit, page, search } : Pick<ItemType, 'limit' | 'page' | 'search'>) {
        try {
        const url = '/items'
        const {data} = await api.get(url, {
            params: {
                search,
                limit,
                page,
            }
        })

        const response = paginatioItemsSchema.safeParse(data)

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

export async function createItem( { formData } : Pick<ItemType, 'formData'>) {
        try {
        const url = '/items'
        const {data} = await api.post<number>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getItemsById( { itemId } : Pick<ItemType, 'itemId'>) {
        try {
        const url = `/items/${itemId}`
        const {data} = await api.get(url)

        const response = ItemSchema.safeParse(data)
        
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

export async function updateItem( { itemId, formData } : Pick<ItemType, 'itemId' | 'formData'>) {
        try {
        const url = `/items/${itemId}`
        const {data} = await api.put<string>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}