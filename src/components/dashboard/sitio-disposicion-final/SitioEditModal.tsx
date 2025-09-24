import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { SitioForm } from '@/src/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDisposicionFinalSitioById, updateDisposicionFinalSitio } from '@/src/api/disposicionFinalApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface SitioEditModalProps {
    open: boolean;
    onClose: () => void;
    id?: string;
}

export default function SitioEditModal({ open, onClose, id }: SitioEditModalProps) {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['disposicionFinalSitio', id],
        queryFn: () => getDisposicionFinalSitioById({ id: id! }),
        enabled: !!id,
    });


    const inputRef = useRef<HTMLInputElement>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<SitioForm>({
        defaultValues: { nombre: '' }
    });

    useEffect(() => {
        if (data) {
            reset({ nombre: data.nombre });
        }
    }, [data, reset]);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open, data]);

    const { mutate, isPending} = useMutation({
        mutationFn: updateDisposicionFinalSitio,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalSitios"] });
            onClose();
        }
    });

    const handleEditSitio = (sitioForm: SitioForm) => {

        if (id) {
            mutate({id, sitioForm})
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
            Editar Sitio
            <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            >
            <CloseIcon />
            </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(handleEditSitio)}>
            <DialogContent>
            <TextField
                inputRef={inputRef}
                margin="dense"
                label="Nombre del sitio"
                type="text"
                fullWidth
                {...register("nombre", { required: true })}
                error={!!errors.nombre}
                helperText={errors.nombre ? "Este campo es requerido" : ""}
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
