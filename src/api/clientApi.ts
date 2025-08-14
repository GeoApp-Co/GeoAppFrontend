import { isAxiosError } from "axios";
import api from "../config/axios";
import { ClienteSchema, paginationClientesSchema } from "../schemas";
import { NewClientFormType } from "../types";

type ClientType = {
    search?: string,
    limit?: number, 
    page?: number,
    clienteId: string
    formData: NewClientFormType
}

export async function getSelectClient( { search, limit, page  } : Pick<ClientType, 'search' | 'limit' | 'page'> ) {
    try {
        const url = '/clientes'
        const {data} = await api.get(url, {
            params: {
                search,
                limit,
                page,
            }
        })

        const response = paginationClientesSchema.safeParse(data)

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

export async function getClienteById( { clienteId } : Pick<ClientType, 'clienteId'>) {
    try {
        const url = `/clientes/${clienteId}`
        const { data } = await api.get(url)


        const response = ClienteSchema.safeParse(data)

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

export async function createClient( { formData } : Pick<ClientType, 'formData'>) {
    try {
        const url = `/clientes/`
        const { data } = await api.post<number>(url, formData)

        return data

    } catch (error) {
                if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateClient( { formData, clienteId } : Pick<ClientType, 'formData' | 'clienteId'>) {
    try {
        const url = `/clientes/${clienteId}`
        const { data } = await api.put<string>(url, formData)

        return data

    } catch (error) {
                if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}