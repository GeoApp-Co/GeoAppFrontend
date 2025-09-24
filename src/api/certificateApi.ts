import { isAxiosError } from "axios";
import { NewCertificateType } from "../types"
import api from "../config/axios";
import { CertificateFullSchema, paginationCertificatesFullSchema } from "../schemas";


type CertificateType = {
    formData: NewCertificateType;
    code?: string;
    clientId?: number;
    page: number;
    limit: number;
};

export async function createCertificate({ formData }: Pick<CertificateType, 'formData'>) {
    try {
        const url = '/certificates';
        // formData debe tener code, clientId, itemIds
        const { data } = await api.post<number>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getCertificateById(id: number) {
    try {
        const url = `/certificates/${id}`;
        const { data } = await api.get(url);
        const response = CertificateFullSchema.safeParse(data);
        if (response.success) {
            return response.data;
        } else {
            console.error("Zod error:", response.error);
            throw new Error("Respuesta de certificado no válida");
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function getCertificatesFull({ code, clientId, limit, page }: Pick<CertificateType, 'code' | 'clientId' | 'limit' | 'page'>) {
    try {
        const url = '/certificates';
        const { data } = await api.get(url, {
            params: { page, limit, code, clientId }
        });
        
        const response = paginationCertificatesFullSchema.safeParse(data);
        if (response.success) {
            return response.data;
        } else {
            console.error("Zod error:", response.error);
            throw new Error("Respuesta de certificados no válida");
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}