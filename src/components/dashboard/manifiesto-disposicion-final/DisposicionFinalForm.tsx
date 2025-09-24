import { updateManifestItemDisposicionFinal } from "@/src/api/manifestItemApi";
import { DisposicionFinalType, ItemDisposicionFinalForm } from "@/src/types";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Props: lista de sitios/licencias/tratamientos, item seleccionado, onSubmit, onChangeItem
interface DisposicionFinalFormProps {
    sitios: DisposicionFinalType[];
    selectedItem: ItemDisposicionFinalForm | null;
}

// Valores del formulario
// export type DisposicionFinalFormValues = {
//     disposicionFinalId: number;
//     tiquete: string;
//     fechaDisposicionFinal: string;
//     certificadoFinal: string;
// };

export default function DisposicionFinalForm({ sitios, selectedItem }: DisposicionFinalFormProps) {
    const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationFn: updateManifestItemDisposicionFinal,
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalManifest"] });
        },
        onError: (error) => {
            toast.error(error.message || "Error al actualizar el item");
        },
    });

    const initialValues : ItemDisposicionFinalForm = {
        manifestItemId: selectedItem ? selectedItem.manifestItemId : 0,
        disposicionFinalId: 0,
        tiquete: "",
        fechaDisposicionFinal: "",
        certificadoFinal: "",
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ItemDisposicionFinalForm>(
        { defaultValues: initialValues }
    )

    // Cuando cambia el item seleccionado, actualiza el formulario
    useEffect(() => {
        if (selectedItem) {
        reset({
            manifestItemId: selectedItem.manifestItemId,
            disposicionFinalId: selectedItem.disposicionFinalId || 0,
            tiquete: selectedItem.tiquete || "",
            fechaDisposicionFinal: selectedItem.fechaDisposicionFinal || "",
            certificadoFinal: selectedItem.certificadoFinal || "",
        });
        }
    }, [selectedItem, reset]);

    // Handler para submit
    const onSubmit = (data: ItemDisposicionFinalForm) => {
        mutate(data);
    };

    return (
        <>
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-end mb-2"
        >

            <div>
                <label className="text-azul font-bold block text-sm mb-1">Sitio/Licencia/Tratamiento</label>
                <Controller
                    name="disposicionFinalId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            displayEmpty
                            className="w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                            renderValue={(selected) => {
                                if (!selected || selected === 0) return "Selecciona un sitio de disposición final";
                                const s = sitios.find(x => x.id === selected);
                                if (!s) return "Selecciona un sitio de disposición final";
                                return (
                                    <span>
                                        <span className="font-semibold text-azul">{s.sitio.nombre}</span>
                                        <span className="text-xs text-gray-600 ml-2">Licencia: {s.licencia.licencia}</span>
                                        <span className="text-xs text-gray-600 ml-2">Tratamiento: {s.tratamiento}</span>
                                    </span>
                                );
                            }}
                        >
                            <MenuItem value={0} disabled>
                                Selecciona un sitio de disposición final
                            </MenuItem>
                            {sitios.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                    <div className="flex flex-col items-start p-1 gap-1">
                                        <span className="font-semibold text-azul">{s.sitio.nombre}</span>
                                        <span className="text-xs text-gray-600">Licencia: {s.licencia.licencia}</span>
                                        <span className="text-xs text-gray-600">Tratamiento: {s.tratamiento}</span>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </div>

            <div>
                <label className="text-azul font-bold block text-sm mb-1">Tiquete</label>
                <Controller
                    name="tiquete"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Tiquete"
                            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                        />
                    )}
                />
            </div>
            

            
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Fecha Certificado Final</label>
                <Controller
                    name="fechaDisposicionFinal"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="date"
                            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                        />
                    )}
                />
            </div>
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Certificado Final</label>
                <Controller
                    name="certificadoFinal"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Certificado Final"
                            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                        />
                    )}
                />
            </div>

            <div className="flex items-end md:col-span-2">
                <Button type="submit" disabled={isPending} variant="contained" color="primary" className="w-full">Guardar</Button>
            </div>
            

        </form>
        {errors && (
            <div className="col-span-2">
                <Typography color="error" variant="caption">
                    {Object.values(errors).map((e) => e?.message).join(" ")}
                </Typography>
            </div>
        )}
        </>
    );
}
