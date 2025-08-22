"use client"
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { updateManifestInvoiceCode } from "@/src/api/manifestApi";
import { toast } from "react-toastify";
import { PaginationManifestCommercialType } from "@/src/types";
import { useForm } from "react-hook-form";

type ManifestInputUpdateProps = {
    manifestId: number
    invoiceCode: string | null
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>

}

type InvoiceFormData = {
    invoiceCode: string;
};

function ManifestInputUpdate( { manifestId, refetch, invoiceCode }  : ManifestInputUpdateProps) {

    const { register, handleSubmit } = useForm<InvoiceFormData>({
        defaultValues: {
        invoiceCode: invoiceCode ?? "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: updateManifestInvoiceCode,
        onError(data) {
            toast.error(data.message)
        },
        onSuccess(data) {
            toast.success(data)
            refetch()
        },
    })

    const onSubmit = (InvoiceCodeFormData: InvoiceFormData) => {
        const str = manifestId.toString();
        mutate({manifestId: str, InvoiceCodeFormData});
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2"
        >
            <input
            type="text"
            placeholder="Código de Factura"
            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
            {...register("invoiceCode", { required: "El código de factura es obligatorio" })}
            />

    
            <Tooltip title="Guardar Cambio">
                <IconButton 
                    type="submit"
                    disabled={isPending}
                    color="success" size="small">
                        {isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                </IconButton>
            </Tooltip>


        </form>
    )
}

export default ManifestInputUpdate
