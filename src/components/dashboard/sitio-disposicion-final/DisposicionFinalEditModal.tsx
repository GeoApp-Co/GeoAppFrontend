import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';
import { DisposicionFinalForm, DisposicionFinalSitioType, DisposicionFinalLicenciaType } from '@/src/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDisposicionFinalById, updateDisposicionFinal } from '@/src/api/disposicionFinalApi';
import { tratamientosDisposicionFinalEnum } from '@/src/schemas';
import { toast } from 'react-toastify';

interface DisposicionFinalEditModalProps {
    open: boolean;
    onClose: () => void;
    id?: string;
    sitios: DisposicionFinalSitioType[];
    licencias: DisposicionFinalLicenciaType[];
}

export default function DisposicionFinalEditModal({ open, onClose, id, sitios, licencias }: DisposicionFinalEditModalProps) {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['disposicionFinal', id],
        queryFn: () => getDisposicionFinalById({ id: id! }),
        enabled: !!id,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<DisposicionFinalForm>({
        defaultValues: { sitioId: 0, licenciaId: 0, tratamiento: 'APROVECHAMIENTO' }
    });

    useEffect(() => {
        if (data) {
            reset({
                sitioId: data.sitio?.id || 0,
                licenciaId: data.licenciaId || 0,
                tratamiento: data.tratamiento || 'APROVECHAMIENTO'
            });
        }
    }, [data, reset]);

    // useEffect(() => {
    //     if (open && inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // }, [open, data]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateDisposicionFinal,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["disposicionFinals"] });
            onClose();
        }
    });

    const handleEdit = (form: DisposicionFinalForm) => {
        if (id) {
            mutate({ id, disposicionFinalForm: form });
        }
    }

    if (data) return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Editar Disposición Final
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(handleEdit)}>
                <DialogContent>
                    <label className="block mb-2 mt-2 font-medium">Sitio</label>
                    <select
                        className="w-full border rounded px-2 py-2 mb-2"
                        {...register('sitioId', { required: true, valueAsNumber: true })}
                        disabled={isLoading || isPending}
                        defaultValue=""
                    >
                        <option value="" disabled>Seleccione un sitio</option>
                        {sitios.map((sitio) => (
                            <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                        ))}
                    </select>
                    {errors.sitioId && <span className="text-red-500 text-xs">El sitio es obligatorio</span>}

                    <label className="block mb-2 mt-2 font-medium">Licencia</label>
                    <select
                        className="w-full border rounded px-2 py-2 mb-2"
                        {...register('licenciaId', { required: true, valueAsNumber: true })}
                        disabled={isLoading || isPending}
                        defaultValue=""
                    >
                        <option value="" disabled>Seleccione una licencia</option>
                        {licencias.map((lic) => (
                            <option key={lic.id} value={lic.id}>{lic.licencia}</option>
                        ))}
                    </select>
                    {errors.licenciaId && <span className="text-red-500 text-xs">La licencia es obligatoria</span>}

                    <label className="block mb-2 mt-2 font-medium">Tratamiento</label>
                    <select
                        className="w-full border rounded px-2 py-2 mb-2"
                        {...register('tratamiento', { required: true })}
                        disabled={isLoading || isPending}
                        defaultValue=""
                    >
                        <option value="" disabled>Seleccione un tratamiento</option>
                        {tratamientosDisposicionFinalEnum.options.map((trat) => (
                            <option key={trat} value={trat}>{trat}</option>
                        ))}
                    </select>
                    {errors.tratamiento && <span className="text-red-500 text-xs">El tratamiento es obligatorio</span>}
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
