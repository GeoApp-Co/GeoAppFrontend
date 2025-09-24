import { tratamientosDisposicionFinalEnum } from '@/src/schemas';
import { DisposicionFinalForm, DisposicionFinalLicenciaType, DisposicionFinalSitioType } from '@/src/types';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { BaseSyntheticEvent } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface DisposicionFinalModalProps {
    open: boolean;
    onClose: () => void;
    handleSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown> | undefined) => Promise<void>;
    register: UseFormRegister<DisposicionFinalForm>;
    errors: FieldErrors<DisposicionFinalForm>;
    loading?: boolean;
    sitios: DisposicionFinalSitioType[];
    licencias: DisposicionFinalLicenciaType[];
}

export default function DisposicionFinalModal({ open, onClose, handleSubmit, loading, register, errors, sitios, licencias }: DisposicionFinalModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Agregar Disposición Final
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <label className="block mb-2 mt-2 font-medium">Sitio</label>
                    <select
                        className="w-full border rounded px-2 py-2 mb-2"
                        {...register('sitioId', { required: true, valueAsNumber: true })}
                        disabled={loading}
                        defaultValue="0"
                    >
                        <option value="0" disabled>Seleccione un sitio</option>
                        {sitios.map((sitio) => (
                            <option key={sitio.id} value={sitio.id}>{sitio.nombre}</option>
                        ))}
                    </select>
                    {errors.sitioId && <span className="text-red-500 text-xs">El sitio es obligatorio</span>}
                    <label className="block mb-2 mt-2 font-medium">Licencia</label>
                    <select
                        className="w-full border rounded px-2 py-2 mb-2"
                        {...register('licenciaId', { required: true, valueAsNumber: true })}
                        disabled={loading}
                        defaultValue="0"
                    >
                        <option value="0" disabled>Seleccione una licencia</option>
                        {licencias.map((lic) => (
                            <option key={lic.id} value={lic.id}>{lic.licencia}</option>
                        ))}
                    </select>
                    {errors.licenciaId && <span className="text-red-500 text-xs">La licencia es obligatoria</span>}
                    <label className="block mb-2 mt-2 font-medium">Tratamiento</label>
                    <select
                        className="w-full border rounded px-2 py-2 mb-2"
                        {...register('tratamiento', { required: true })}
                        disabled={loading}
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
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        Agregar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
