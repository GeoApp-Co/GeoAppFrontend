"use client";

import { IconButton, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { changeIsEditManifest } from "@/src/api/manifestApi";
import { toast } from "react-toastify";
import { ManifestType, PaginationManifestCommercialType } from "@/src/types";

type EditLockButtonProps = {
  isEdit: boolean;
  manifestId: number
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>
};

export default function EditLockButton({ isEdit, manifestId, refetch}: EditLockButtonProps) {

  const { mutate, isPending} = useMutation({
    mutationFn: changeIsEditManifest,
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data ) {
      toast.success(data)
      refetch()
    },
  })

  const handleChangeIsEditManifest = (manifestId: ManifestType['id']) => {

    const stringManifestId = manifestId.toString()
    mutate({manifestId: stringManifestId})
  }

  return (
    <Tooltip title={isEdit ? "Modo Edición (Desbloqueado)" : "Modo Lectura (Bloqueado)"}>
      <IconButton 
        onClick={ () => handleChangeIsEditManifest(manifestId)}
        disabled={isPending}
        sx={{
          color: isEdit ? "green" : "red",
          transition: "0.3s ease",
        }}
      >
        {isEdit ? <LockOpenIcon /> : <LockIcon />}
      </IconButton>
    </Tooltip>
  );
}
