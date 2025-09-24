import { isAxiosError } from "axios";
import api from "../config/axios";
import { ItemDisposicionFinalForm } from "@/src/types";

type ManifestItemType  = {
    id: number
}

export async function updateManifestItemDisposicionFinal({ manifestItemId, ...rest }: ItemDisposicionFinalForm) {
    try {
        const { data } = await api.put(`/manifest-items/${manifestItemId}/disposicion-final`, rest);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al actualizar el item");
        }
        throw error;
    }
}

export async function updateManifestItemDisposicionFinalEntregado({ id }: ManifestItemType) {
    try {
        const { data } = await api.put(`/manifest-items/${id}/disposicion-final-entregado`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al actualizar el item");
        }
        throw error;
    }
}
