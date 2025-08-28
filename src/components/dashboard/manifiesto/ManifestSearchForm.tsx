"use client"
import { SearchManifestForm } from "@/src/types"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ClientSelectInput from "../manifiesto-comercial/ClientSelectInput"
import { useQuery } from "@tanstack/react-query"
import { getSelectTemplates } from "@/src/api/templateApi"

function ManifestSearchForm() {

    const router = useRouter()

    const { data } = useQuery({
        queryKey: ["templates"],
        queryFn: () => getSelectTemplates({ search: "" }),
    });

    const initialValues : SearchManifestForm = {
        clientId: '',
        fecha: null,
        estado: '',
        manifestTemplate: ''
    }

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
    } = useForm({
        defaultValues: initialValues,
    });

    const handleSearchForm = (formData: SearchManifestForm) => {
        const { clientId, estado, fecha, manifestTemplate } = formData;

        const fechaFormateada = fecha
            ? `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
            : '';

        // Validar si todos los campos están vacíos
        const sinClientId = !clientId?.trim();
        const sinEstado = !estado?.trim();
        const sinFecha = !fechaFormateada;
        const sinTemplate = !manifestTemplate;

        if (sinClientId && sinEstado && sinFecha) {
            toast.error("Debe ingresar al menos un filtro de búsqueda");
            return;
        }

        // Construir query dinámicamente
        const queryParams = new URLSearchParams();

        if (!sinClientId) queryParams.append("clientId", clientId);
        if (!sinEstado) queryParams.append("estado", estado.trim());
        if (!sinFecha) queryParams.append("fecha", fechaFormateada);
        if (!sinTemplate) queryParams.append("manifestTemplatedId", manifestTemplate);

        const queryString = queryParams.toString();
        router.push(`/dashboard/manifiesto/search?${queryString}`);
    };



    return (
        <form
        onSubmit={handleSubmit(handleSearchForm)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >

            <div>
                <label className="text-azul font-bold block text-sm mb-1">Estado / Proceso</label>
            <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                {...register('estado')}

            >
                <option value="">Filtrar por Estado</option>
                <option value="isInvoiced">Factura</option>
                <option value="isInternallyInvoiced">Disposición Final</option>
                <option value="isCertified">Certificado</option>
            </select>

            </div>

            <ClientSelectInput
                setValueManifest={setValue}
                watchManifest={watch} 
            />

            <div className="w-full">

                <label className="text-azul font-bold block text-sm mb-1">Fecha</label>
                <Controller
                control={control}
                name="fecha"
                render={({ field }) => {
                    const { value, onChange } = field;
                    return (
                    <DatePicker
                        selected={value}
                        onChange={onChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        placeholderText="Seleccionar Mes"
                        wrapperClassName="w-full"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    />
                    );
                }}
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

            <input 
                type="submit" 
                value={'Buscar'}
                className="bg-verde w-full lg:w-auto text-xl  px-4 py-2 text-center font-bold cursor-pointer text-white rounded-xl hover:bg-lime-200 hover:text-verde  border-verde md:col-span-2"
            />
        </form>
    )
}

export default ManifestSearchForm

