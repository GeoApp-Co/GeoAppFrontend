"use client";
import { createNps } from "@/src/api/npsApi";
import { periodos } from "@/src/schemas";
import { NpsFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export type NpsCreateDialogProps = {
    open: boolean;
    onClose: () => void;
    clienteId: number;
    onRefresh?: () => void;
};

export default function NpsCreateDialog({ open, onClose, clienteId, onRefresh }: NpsCreateDialogProps) {


    const initialValues : NpsFormType = {
        clienteId: clienteId,
        personaEncuestada: "",
        cargo: "",
        encuestado: false,
        fechaEncuesta: new Date().toISOString().slice(0, 10),
        puntaje: 0,
        observaciones: "",
        periodo: "mensual",
    }

    const {handleSubmit, formState: { errors}, register, watch, setValue, reset} = useForm<NpsFormType>({
        defaultValues: initialValues,
        mode: "onTouched",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createNps,
        onSuccess: (data) => {
            toast.success(data)
            if (onRefresh) {
                onRefresh();
            }
            onClose();
            reset();
        },
        onError: (data) => {
            toast.error(data.message)
        }
    });

    const onSubmit = (formData: NpsFormType) => {
        mutate({ clienteId, formData });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Crear Encuesta NPS</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <div>
                            <label className="text-azul font-bold block text-sm mb-1">Persona encuestada</label>
                            <input
                                type="text"
                                {...register("personaEncuestada", { required: "La persona encuestada es obligatoria" })}
                                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                            />
                            { errors.personaEncuestada && <ErrorMessage>{errors.personaEncuestada?.message}</ErrorMessage>}
                        </div>
                        <div>
                            <label className="text-azul font-bold block text-sm mb-1">Cargo</label>
                            <input
                                type="text"
                                {...register("cargo", { required: "El cargo es obligatorio" })}
                                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                            />
                            {errors.cargo && <ErrorMessage>{errors.cargo?.message}</ErrorMessage>}
                        </div>
                        <div>
                            <FormControlLabel
                                control={<Checkbox {...register("encuestado")} checked={watch("encuestado")} />}
                                label={<span className="text-azul font-bold text-sm">¿Encuestado?</span>}
                            />
                        </div>
                        <div>
                            <label className="text-azul font-bold block text-sm mb-1">Fecha de encuesta</label>
                            <input
                                type="date"
                                {...register("fechaEncuesta", { required: "La fecha de la encuesta es obligatoria" })}
                                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                            />
                            { errors.fechaEncuesta && <ErrorMessage>{errors.fechaEncuesta?.message}</ErrorMessage>}
                        </div>
                        <div>
                            <label className="text-azul font-bold block text-sm mb-1">Puntaje</label>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Rating
                                    precision={0.5}
                                    max={5}
                                    value={Number(watch("puntaje"))}
                                    onChange={(_, value) => setValue("puntaje", value ?? 0)}
                                    sx={{
                                        fontSize: 32,
                                        color: '#2563eb',
                                        '& .MuiRating-iconFilled': {
                                            color: '#2563eb',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: '#1e40af',
                                        },
                                    }}
                                />
                                <span className="ml-2 text-lg font-bold text-azul">{watch("puntaje")}</span>
                            </Box>
                            { errors.puntaje && <ErrorMessage>{errors.puntaje?.message || "El puntaje es obligatorio"}</ErrorMessage>}
                        </div>
                        <div>
                            <label className="text-azul font-bold block text-sm mb-1">Periodo</label>
                            <select
                                {...register("periodo", { required: "El periodo es obligatorio" })}
                                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                            >
                                {periodos.options.map((p) => (
                                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                ))}
                            </select>
                            { errors.periodo && <ErrorMessage>{errors.periodo?.message}</ErrorMessage>}
                        </div>
                        <div>
                            <label className="text-azul font-bold block text-sm mb-1">Observaciones</label>
                            <textarea
                                {...register("observaciones")}
                                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                                rows={2}
                            />
                            { errors.observaciones && <ErrorMessage>{errors.observaciones?.message}</ErrorMessage>}
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isPending}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isPending}>
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
