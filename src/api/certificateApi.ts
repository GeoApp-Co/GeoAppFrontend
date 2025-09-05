import { isAxiosError } from "axios";
import { NewCertificateType } from "../types"
import api from "../config/axios";
import { da } from "zod/v4/locales";
import { paginationCertificatesSchema } from "../schemas";

type CertificateType = {
    formData: NewCertificateType
    No?: string
    clientId?: string
    page: number
    limit: number
}

export async function createCertificate({ formData } : Pick<CertificateType, 'formData'>) {
    try {
        const url = '/certificates'

        const { data } = await api.post<number>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getCertificates({ No, clientId, limit, page } : Pick<CertificateType, 'No' | 'clientId' | 'limit' | 'page'>) {
    try {
        const url = '/certificates'

        const { data } = await api.get(url, {
            params: {
                page,
                limit,
                No,
                clientId: clientId
            }
        })

        const response = paginationCertificatesSchema.safeParse(data)
        
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