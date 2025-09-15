import { isAxiosError } from "axios"
import api from "../config/axios"
import { ItemSchema, paginatioItemsSchema } from "../schemas"
import { NewItemFormType } from "../types"

type ItemType = {
    search?: string,
    categoria?: string,
    limit?: number, 
    page?: number,
    formData: NewItemFormType
    itemId: string
    manifestItemId: number
}

export async function getItems( { limit, page, search, categoria } : Pick<ItemType, 'limit' | 'page' | 'search'| 'categoria' >) {
        try {
        const url = '/items'
        const {data} = await api.get(url, {
            params: {
                search,
                limit,
                page,
                categoria
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

export async function updateInvoiceStatusItem( { manifestItemId } : Pick<ItemType, 'manifestItemId'>) {
        try {
        const url = `/items/${manifestItemId}/inVoice-status`
        const {data} = await api.put<string>(url)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}