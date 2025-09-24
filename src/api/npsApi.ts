import { isAxiosError } from "axios";
import api from "../config/axios";
import { NpsSchema, paginationNpsSchema } from "../schemas";
import { NpsFormType } from "../types";


type NpsType = {
    id: number;
    clienteId: number;
    page: number;
    limit: number;
    formData: NpsFormType
}

export async function getNpsByClienteId({ clienteId, page, limit }: Pick<NpsType, 'clienteId' | 'page' | 'limit'>) {
    try {
        const url = `/nps/clientes/${clienteId}`;
        const { data } = await api.get(url, { params: { page, limit } });
        const parsed = paginationNpsSchema.safeParse(data);
        
        if (parsed.success) {
          return parsed.data;
        }
        throw new Error("Respuesta de NPS no válida");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function getNpsById({ clienteId, id } : Pick<NpsType, 'id' | 'clienteId'>) {
    try {
        const url = `/nps/${id}/clientes/${clienteId}`;
        const { data } = await api.get(url);
        const parsed = NpsSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error("Respuesta de NPS no válida");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function createNps({ clienteId, formData } : Pick<NpsType, 'clienteId' | 'formData' >) {
    try {
        const url = `/nps/clientes/${clienteId}`;
        const { data } = await api.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function updateNps({ clienteId, formData, id} : Pick<NpsType, 'clienteId' | 'formData' | 'id' >) {
    try {
        const url = `/nps/${id}/clientes/${clienteId}`;
        const { data } = await api.put<string>(url, formData);
        return data;
        throw new Error("Respuesta de NPS no válida");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function deleteNps({ clienteId, id} : Pick<NpsType, 'clienteId' | 'id' >) {
    try {
        const url = `/nps/${id}/clientes/${clienteId}`;
        const {data} = await api.delete<string>(url);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error);
        }
        throw error;
    }
  }
