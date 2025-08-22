import { isAxiosError } from "axios";
import { ManifestItemPriceType } from "../components/dashboard/manifiesto-comercial/ManifestCommercialTable";
import api from "../config/axios";
import { ManifestSchema, paginationManifestCommercialSchema, paginationManifestSchema } from "../schemas";
import { InvoiceCodeFormType, ManifestCommerceSearchFormData, NewManifestFormType } from "../types";


type ManifestType = {
    page: number, 
    limit: number, 
    search?: string,
    estado?: string,
    fecha?: string,
    manifestId: string
    formData: NewManifestFormType
    InvoiceCodeFormData: InvoiceCodeFormType
    manifestItemPriceFormData: ManifestItemPriceType[]
} & ManifestCommerceSearchFormData

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
        console.log(response);

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

export async function getCommercialManifest({  limit, page, clientId, fechaMes, item, location, manifestTemplate, manifestId } : Pick<ManifestType, 'limit' | 'page' | 'clientId' | 'fechaMes' | 'item' | 'manifestTemplate' | 'location' | 'manifestId' >) {
    try {
        const url = '/manifests/commercial'
        const { data } = await api.get(url, {
            params: {
                page,
                limit,
                clientId, 
                fechaMes, 
                item, 
                location,
                manifestTemplate,
                manifestId
            }
        })
        
        const response = paginationManifestCommercialSchema.safeParse(data)
        console.log(response.error);
        
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

export async function updateManifestItemPrice( { manifestId, manifestItemPriceFormData } : Pick<ManifestType, 'manifestId' | 'manifestItemPriceFormData'>) {
    try {
        const url = `/manifests/${manifestId}/manifest-item-price`

        const {data} = await api.put<string>(url, manifestItemPriceFormData )

        return data

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

export async function updateManifestInvoiceCode({ manifestId, InvoiceCodeFormData} : Pick<ManifestType, 'manifestId' | 'InvoiceCodeFormData'>  ) {
    try {
        const url = `/manifests/${manifestId}/invoice-code`

        const {data} = await api.put<string>(url, InvoiceCodeFormData)

        return data

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