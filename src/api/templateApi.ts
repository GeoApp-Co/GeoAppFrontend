import { isAxiosError } from "axios";
import api from "../config/axios";
import { paginationTemplatesSchema, templateSchema, templatesSchema } from "../schemas";
import { NewTemplateFormType } from "../types";

type TemplateType = {
    search?: string,
    page: number
    limit: number
    formData: NewTemplateFormType
    templateId: string
}

export async function getSelectTemplates( { search } : Pick<TemplateType, 'search'> ) {
    try {
        const url = '/templates'
        const {data} = await api.get(url, {
            params: {
                search
            }
        })

        const response = templatesSchema.safeParse(data)

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

export async function createTemplate( { formData } : Pick<TemplateType, 'formData'> ) {
    try {
        const url = '/templates'
        const {data} = await api.post<number>(url, formData)

        return data

        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getTemplates( { search, page, limit } : Pick<TemplateType, 'search' | 'page' | 'limit'> ) {
    try {
        const url = '/templates'
        const {data} = await api.get(url, {
            params: {
                search,
                page,
                limit
            }
        })

        const response = paginationTemplatesSchema.safeParse(data)

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

export async function getTemplateById( { templateId  } : Pick<TemplateType, 'templateId'> ) {
    try {
        const url = `/templates/${templateId}`
        const {data} = await api.get(url)

        const response = templateSchema.safeParse(data)

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

export async function updateTemplate( { templateId, formData} : Pick<TemplateType, 'templateId' | 'formData'> ) {
    try {
        const url = `/templates/${templateId}`
        const {data} = await api.put<string>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}