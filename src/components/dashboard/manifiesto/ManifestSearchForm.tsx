"use client"
import { SearchManifestForm } from "@/src/types"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"

function ManifestSearchForm() {

    const router = useRouter()

    const initialValues : SearchManifestForm = {
        search: '',
        fecha: null,
        estado: ''
    }

    const {
        register,
        handleSubmit,
        control
    } = useForm({
        defaultValues: initialValues,
    });

    const handleSearchForm = (formData: SearchManifestForm) => {
        const { search, estado, fecha } = formData;

        const fechaFormateada = fecha
            ? `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
            : '';

        // Validar si todos los campos están vacíos
        const sinSearch = !search?.trim();
        const sinEstado = !estado?.trim();
        const sinFecha = !fechaFormateada;

        if (sinSearch && sinEstado && sinFecha) {
            toast.error("Debe ingresar al menos un filtro de búsqueda");
            return;
        }

        // Construir query dinámicamente
        const queryParams = new URLSearchParams();

        if (!sinSearch) queryParams.append("search", search.trim());
        if (!sinEstado) queryParams.append("estado", estado.trim());
        if (!sinFecha) queryParams.append("fecha", fechaFormateada);

        const queryString = queryParams.toString();
        router.push(`/dashboard/manifiesto/search?${queryString}`);
    };



    return (
        <form
        onSubmit={handleSubmit(handleSearchForm)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >


            <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                {...register('estado')}

            >
                <option value="">Filtrar por Estado</option>
                <option value="isInvoiced">Factura</option>
                <option value="isInternallyInvoiced">Disposición Final</option>
                <option value="isCertified">Certificado</option>
            </select>

            <input
                type="text"
                placeholder="Nombre, Nit/CC "
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                {...register('search')}
            />

            <div className="w-full">

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

            <input 
                type="submit" 
                value={'Buscar'}
                className="bg-verde w-full lg:w-auto text-xl  px-4 py-2 text-center font-bold cursor-pointer text-white rounded-xl hover:bg-lime-200 hover:text-verde  border-verde"
            />

        </form>
    )
}

export default ManifestSearchForm

