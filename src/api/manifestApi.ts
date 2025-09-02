import { isAxiosError } from "axios";
import api from "../config/axios";
import { manifestSchema, paginationManifestCommercialSchema, paginationManifestInvoicelSchema, paginationManifestSchema } from "../schemas";
import { InvoiceCodeFormType, ManifestInvoiceSearchFormData, NewManifestFormType, QuotationCodeFormType, UpdateManifestFormType } from "../types";


type ManifestType = {
    page: number, 
    limit: number, 
    clientId?: string,
    manifestTemplate?: string,
    estado?: string,
    fecha?: string,
    manifestId: string
    formData: NewManifestFormType
    updateManifestformData: UpdateManifestFormType
    InvoiceCodeFormData: InvoiceCodeFormType
    quotationCodeFormType: QuotationCodeFormType
} & ManifestInvoiceSearchFormData

export async function getManifest( {  limit, page, estado, clientId, fecha, manifestTemplate } : Pick<ManifestType, 'estado' | 'limit' | 'page' | 'clientId' | 'fecha' | 'manifestTemplate'>) {
    try {
        const url = '/manifests'
        const { data } = await api.get(url, {
            params: {
                page,
                limit,
                clientId,
                manifestTemplate,
                estado,
                fecha
            }
        }) 

        const response = paginationManifestSchema.safeParse(data)

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

export async function getInvoiceManifest({  limit, page, clientId, fechaMes, item, location, manifestTemplate, manifestId, invoiceCode, quotationCode, isInvoiced } : Pick<ManifestType, 'limit' | 'page' | 'clientId' | 'fechaMes' | 'item' | 'manifestTemplate' | 'location' | 'manifestId' | 'quotationCode' | 'invoiceCode' | 'isInvoiced'>) {
    try {
        const url = '/manifests/invoice'
        const { data } = await api.get(url, {
            params: {
                page,
                limit,
                clientId, 
                fechaMes, 
                item, 
                location,
                manifestTemplate,
                manifestId,
                quotationCode,
                invoiceCode, 
                isInvoiced
            }
        })
        
        const response = paginationManifestInvoicelSchema.safeParse(data)
        
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
export async function getCommercialManifest({  limit, page, clientId, fechaMes, item, location, manifestTemplate, manifestId, quotationCode, isInvoiced } : Pick<ManifestType, 'limit' | 'page' | 'clientId' | 'fechaMes' | 'item' | 'manifestTemplate' | 'location' | 'manifestId' | 'quotationCode' | 'isInvoiced' >) {
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
                manifestId,
                quotationCode,
                isInvoiced
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

// export async function updateManifestItemPrice( { manifestId, manifestItemPriceFormData } : Pick<ManifestType, 'manifestId' | 'manifestItemPriceFormData'>) {
//     try {
//         const url = `/manifests/${manifestId}/manifest-item-price`

//         const {data} = await api.put<string>(url, manifestItemPriceFormData )

//         return data

//     } catch (error) {
//         if (isAxiosError(error) && error.response) {
//             console.log(error);
//             throw new Error(error.response.data.error);
//         }
//     }
// }

export async function getManifestById({ manifestId } : Pick<ManifestType, 'manifestId'>  ) {
    try {
        const url = `/manifests/${manifestId}`

        const {data} = await api.get(url)

        const response = manifestSchema.safeParse(data)
        
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

export async function updateManifestInvoiceCode({ InvoiceCodeFormData} : Pick<ManifestType, 'InvoiceCodeFormData'>  ) {
    try {
        const url = `/manifests/invoice-code`

        const {data} = await api.put<string>(url, InvoiceCodeFormData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateManifestQuotationCode({ quotationCodeFormType } : Pick<ManifestType, 'quotationCodeFormType'>  ) {
    try {
        const url = `/manifests/quotation-code`

        const {data} = await api.put<string>(url, quotationCodeFormType)

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

export async function updateManifest( { manifestId, updateManifestformData } : Pick<ManifestType, 'updateManifestformData' | 'manifestId'>) {
    try {
        const url = `/manifests/${manifestId}`
        const { data } = await api.put<string>(url, updateManifestformData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function changeIsEditManifest( { manifestId } : Pick<ManifestType, 'manifestId' >) {
    try {
        const url = `/manifests/${manifestId}/change-isEdit`
        const { data } = await api.put<string>(url)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}