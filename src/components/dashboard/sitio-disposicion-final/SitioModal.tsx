import { SitioForm } from '@/src/types';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { BaseSyntheticEvent } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface SitioModalProps {
    open: boolean;
    onClose: () => void;
    handleSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown> | undefined) => Promise<void>
    register: UseFormRegister<SitioForm>
    errors: FieldErrors<SitioForm>
    loading?: boolean;
}

export default function SitioModal({ open, onClose, handleSubmit, loading, register, errors }: SitioModalProps) {


    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
            Agregar Sitio
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
                label="Nombre del sitio"
                type="text"
                fullWidth
                {...register("nombre", { required: true })}
                error={!!errors.nombre}
                helperText={errors.nombre ? "Este campo es requerido" : ""}
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
