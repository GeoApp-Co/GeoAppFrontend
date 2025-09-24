import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';
import { LicenciaForm } from '@/src/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDisposicionFinalLicenciaById, updateDisposicionFinalLicencia } from '@/src/api/disposicionFinalApi';
import { toast } from 'react-toastify';

interface LicenciaEditModalProps {
    open: boolean;
    onClose: () => void;
    id?: string;
}

export default function LicenciaEditModal({ open, onClose, id }: LicenciaEditModalProps) {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['disposicionFinalLicencia', id],
        queryFn: () => getDisposicionFinalLicenciaById({ id: id! }),
        enabled: !!id,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LicenciaForm>({
        defaultValues: { licencia: '' }
    });

    useEffect(() => {
        if (data) {
            reset({ licencia: data.licencia });
        }
    }, [data, reset]);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open, data]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateDisposicionFinalLicencia,
        onError(error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error desconocido");
            }
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalLicencias"] });
            onClose();
        }
    });

    const handleEditLicencia = (licenciaForm: LicenciaForm) => {
        if (id) {
            mutate({ id, licenciaForm })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Editar Licencia
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(handleEditLicencia)}>
                <DialogContent>
                    <TextField
                        inputRef={inputRef}
                        margin="dense"
                        label="Licencia"
                        type="text"
                        fullWidth
                        {...register("licencia", { required: true })}
                        error={!!errors.licencia}
                        helperText={errors.licencia ? "Este campo es requerido" : ""}
                        disabled={isLoading || isPending}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isPending || isLoading}>
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
