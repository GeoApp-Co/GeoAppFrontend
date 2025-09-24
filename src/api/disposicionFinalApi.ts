import { DisposicionFinalForm } from "../types";
import { isAxiosError } from "axios";
import api from "../config/axios";
import { DisposicionFinalLicenciaSchema, DisposicionFinalSchema, DisposicionFinalSitioSchema, responseDisposicionFinalSitioSchema } from "../schemas";
import { responseDisposicionFinalLicenciaSchema } from "../schemas";
import { responseDisposicionFinalSchema } from "../schemas";
import { LicenciaForm, SitioForm } from "../types";

type DisposicionFinalType = {
    id: string
    licenciaForm: LicenciaForm
    sitioForm: SitioForm
    disposicionFinalForm: DisposicionFinalForm
}

export async function getDisposicionFinals() {
    try {
        const url = "/disposicion-final";
        const { data } = await api.get(url);
        const response = responseDisposicionFinalSchema.safeParse(data);
        if (response.success) return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getDisposicionFinalById( { id } : Pick<DisposicionFinalType, 'id'> ) {
    try {
        const { data } = await api.get(`/disposicion-final/${id}`);
        const parsed = DisposicionFinalSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error("Error al obtener combinación de disposición final");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function createDisposicionFinal({ disposicionFinalForm }: Pick<DisposicionFinalType, 'disposicionFinalForm'>) {
    try {
        const { data } = await api.post<string>("/disposicion-final", disposicionFinalForm);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function updateDisposicionFinal({ id, disposicionFinalForm }: Pick<DisposicionFinalType, 'id' | 'disposicionFinalForm'>) {
    try {
        const { data } = await api.put<string>(`/disposicion-final/${id}`, disposicionFinalForm);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function deleteDisposicionFinal({ id }:  Pick<DisposicionFinalType, 'id'>) {
    try {
        const { data } = await api.delete(`/disposicion-final/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function getDisposicionFinalSitios() {
    try {
        const url = "/disposicion-final-sitios";
        const { data } = await api.get(url);
        const response = responseDisposicionFinalSitioSchema.safeParse(data);
        if (response.success) return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getDisposicionFinalSitioById( { id } : Pick<DisposicionFinalType, 'id'> ) {
    try {
        const { data } = await api.get(`/disposicion-final-sitios/${id}`);
        const parsed = DisposicionFinalSitioSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error("Error al obtener sitio de disposición final");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}



export async function createDisposicionFinalSitio( { sitioForm } : Pick<DisposicionFinalType, 'sitioForm'>) {
    try {
        const { data } = await api.post<string>("/disposicion-final-sitios", sitioForm);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function updateDisposicionFinalSitio({ id, sitioForm }: Pick<DisposicionFinalType, 'id' | 'sitioForm'>) {
    try {
        const { data } = await api.put<string>(`/disposicion-final-sitios/${id}`, sitioForm);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function deleteDisposicionFinalSitio({ id }: Pick<DisposicionFinalType, 'id'>) {
    try {
        const { data } = await api.delete(`/disposicion-final-sitios/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function getDisposicionFinalLicencias() {
    try {
        const url = "/disposicion-final-licencias";
        const { data } = await api.get(url);
        const response = responseDisposicionFinalLicenciaSchema.safeParse(data);
        if (response.success) return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getDisposicionFinalLicenciaById( { id } : Pick<DisposicionFinalType, 'id'> ) {
    try {
        const { data } = await api.get(`/disposicion-final-licencias/${id}`);
        const parsed = DisposicionFinalLicenciaSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error("Error al obtener licencia de disposición final");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function createDisposicionFinalLicencia( { licenciaForm } : Pick<DisposicionFinalType, 'licenciaForm'>) {
    try {
        const { data } = await api.post<string>("/disposicion-final-licencias", licenciaForm);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function updateDisposicionFinalLicencia({ id, licenciaForm }: Pick<DisposicionFinalType, 'id' | 'licenciaForm'>) {
    try {
        const { data } = await api.put<string>(`/disposicion-final-licencias/${id}`, licenciaForm);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function deleteDisposicionFinalLicencia({ id }: Pick<DisposicionFinalType, 'id'>) {
    try {
        const { data } = await api.delete(`/disposicion-final-licencias/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

