"use client"
import { SearchForm } from "@/src/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function TemplateSearchForm() {
    
    const router = useRouter()

    const initialValues : SearchForm = {
        search: '',
    }

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: initialValues,
    });

    const handleTemplateSearchForm = (formData: SearchForm) => {

        const { search} = formData;

        // Validar si todos los campos están vacíos
        const sinSearch = !search?.trim();


        if (sinSearch) {
            toast.error("Debe ingresar un valor para la búsqueda");
            return;
        }

        // Construir query dinámicamente
        const queryParams = new URLSearchParams();

        if (!sinSearch) queryParams.append("search", search.trim());


        const queryString = queryParams.toString();
        router.push(`/dashboard/plantilla/search?${queryString}`);
    };
    return (
        
        <form
            onSubmit={handleSubmit(handleTemplateSearchForm)}
            className=" flex gap-3"
        >

            <input
                type="text"
                placeholder="Buscar Plantilla por Nombre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                {...register('search')}
            />

            <input 
                type="submit" 
                value={'Buscar'}
                className="bg-verde w-full lg:w-auto text-xl  px-4 py-2 text-center font-bold cursor-pointer text-white rounded-xl hover:bg-lime-200 hover:text-verde  border-verde"
            />

        </form>
        
    )
}

export default TemplateSearchForm
