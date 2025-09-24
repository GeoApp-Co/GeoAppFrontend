import { updateInvoiceStatusItem } from "@/src/api/itemApi";
import { ManifestItemType, PaginationManifestCommercialType } from "@/src/types";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, TableCell, Typography } from "@mui/material";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface InvoiceStatusCellProps {
    isInvoiced: ManifestItemType['isInvoiced']
    manifestItemId: number
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>
}

export default function InvoiceStatusCell({ isInvoiced, manifestItemId, refetch }: InvoiceStatusCellProps) {


    const { mutate, isPending} = useMutation({
        mutationFn: updateInvoiceStatusItem,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess(data ) {
            toast.success(data)
            refetch()
        },
    })

    const handleUpdateInvoiceStatusItem = ( manifestItemId: number ) => {
        mutate({manifestItemId})
    }

    return (
        
        <Stack direction="row" spacing={1} alignItems="center" justifyContent='space-between'>
            {isInvoiced ? (
            <>
                <Typography variant="body2" color="success.main">
                Facturar
                </Typography>
            </>
            ) : (
            <>
                <Typography variant="body2" color="error.main">
                -------
                </Typography>
            </>
            )}

            {/* Botón de acción */}
            <IconButton
                size="small"
                color="primary"
                onClick={() => handleUpdateInvoiceStatusItem(manifestItemId)}
                disabled={isPending}
            >
            <EditIcon />
            </IconButton>
        </Stack>

    );
}
