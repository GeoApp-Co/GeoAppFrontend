import { isAxiosError } from "axios";
import api from "../config/axios";
import { ManifestSchema, paginationManifestSchema } from "../schemas";
import { NewManifestFormType } from "../types";


type ManifestType = {
    page: number, 
    limit: number, 
    search?: string,
    estado?: string,
    fecha?: string,
    manifestId: string
    formData: NewManifestFormType
}

export async function getManifest( {  limit, page, estado, search, fecha } : Pick<ManifestType, 'estado' | 'limit' | 'page' | 'search' | 'fecha'>) {
    try {
        const url = '/manifests'
        const { data } = await api.get(url, {
            params: {
                page,
                limit,
                search,
                estado,
                fecha
            }
        }) 

        const response = paginationManifestSchema.safeParse(data)

        // console.log(response);
        if (response.success) {
            // console.log(response.data);
            
            return response.data
        }


    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getManifestById({ manifestId } : Pick<ManifestType, 'manifestId'>  ) {
    try {
        const url = `/manifests/${manifestId}`

        const {data} = await api.get(url)

        const response = ManifestSchema.safeParse(data)

        
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

export async function createManifest( { formData } : Pick<ManifestType, 'formData' >) {
    try {
        const url = '/manifests'
        const { data } = await api.post<number>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}