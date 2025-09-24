import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { LicenciaForm } from '@/src/types';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface LicenciaModalProps {
    open: boolean;
    onClose: () => void;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<LicenciaForm>;
    errors: FieldErrors<LicenciaForm>;
    loading?: boolean;
}

export default function LicenciaModal({ open, onClose, handleSubmit, register, errors, loading }: LicenciaModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
            Agregar Licencia
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
            <TextField
                autoFocus
                margin="dense"
                label="Licencia"
                type="text"
                fullWidth
                {...register("licencia", { required: true })}
                error={!!errors.licencia}
                helperText={errors.licencia ? "Este campo es requerido" : ""}
            />
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
