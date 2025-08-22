"use client";
import { getSelectTemplates } from "@/src/api/templateApi";
import { ManifestCommerceSearchFormData } from "@/src/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import ClientSelectInput from "./ClientSelectInput";

type Props = {
    setFilters: (filters: ManifestCommerceSearchFormData) => void;
};

function ManifestCommercialSearchForm({ setFilters }: Props) {
    const { data } = useQuery({
        queryKey: ["templates"],
        queryFn: () => getSelectTemplates({ search: "" }),
    });

    const { register, control, watch, reset, setValue} = useForm<ManifestCommerceSearchFormData>({
        defaultValues: {
        clientId: "",
        fechaMes: null,
        manifestTemplate: "",
        location: "",
        item: "",
        },
    });

    const formValues = watch();

    const debouncedUpdate = useMemo(
        () =>
        debounce((values: ManifestCommerceSearchFormData) => {
            const newFilters: ManifestCommerceSearchFormData = {
                clientId: values.clientId || "",
                fechaMes: values.fechaMes || null,
                manifestTemplate: values.manifestTemplate || "",
                location: values.location || "",
                item: values.item || "",
                manifestId: values.manifestId || ""
            };
            setFilters(newFilters);
        }, 2500),
        [setFilters]
    );

    useEffect(() => {
        debouncedUpdate(formValues);
        return () => debouncedUpdate.cancel();
    }, [formValues, debouncedUpdate]);

    return (
        <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="text-azul font-bold">Filtros de búsqueda</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo: Nombre, alias o identificación */}
            {/* <div>
                <label className="text-azul font-bold block text-sm mb-1">
                Nombre, alias o identificación
                </label>
                <input
                type="text"
                {...register("nameOrAlias")}
                placeholder="Nombre, alias o identificación"
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                />
            </div> */}

            <ClientSelectInput
                setValue={setValue} 
                watch={watch}
            />

            <div>
                <label className="text-azul font-bold block text-sm mb-1">Manifiesto ID</label>
                <input
                type="text"
                {...register("manifestId")}
                placeholder="Id, Secuencia del Manifiesto"
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                />
            </div>

            {/* Campo: Fecha */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Fecha (Mes/Año)</label>
                <Controller
                control={control}
                name="fechaMes"
                render={({ field }) => (
                    <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Seleccionar Mes"
                    wrapperClassName="w-full"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all bg-white"
                    />
                )}
                />
            </div>

            {/* Campo: Plantilla de manifiesto */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Plantilla de Manifiesto</label>
                <select
                {...register("manifestTemplate")}
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                >
                <option value="">Seleccione una plantilla</option>
                {data?.templates.map((template) => (
                    <option key={template.id} value={template.id}>
                    {template.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Campo: Ubicación */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Ubicación</label>
                <input
                type="text"
                {...register("location")}
                placeholder="Ubicación del manifiesto"
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                />
            </div>

            {/* Campo: Item */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Item</label>
                <input
                type="text"
                {...register("item")}
                placeholder="Buscar por ítem"
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
                />
            </div>
            </form>

            <div className="mt-4 flex justify-end">
            <button
                type="button"
                onClick={() => {
                reset();
                setFilters({
                    clientId: '',
                    fechaMes: null,
                    manifestTemplate: "",
                    location: "",
                    item: "",
                    manifestId: ""
                });
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
                Reiniciar filtros
            </button>
            </div>
        </AccordionDetails>
        </Accordion>
    );
}

export default ManifestCommercialSearchForm;
