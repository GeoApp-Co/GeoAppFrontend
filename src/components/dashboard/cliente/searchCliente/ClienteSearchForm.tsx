"use client"
import { SearchForm } from "@/src/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function ClienteSearchForm() {
    
    const router = useRouter()

    const initialValues : SearchForm = {
        search: '',
    }

    const {
        register,
        handleSubmit,
        control
    } = useForm({
        defaultValues: initialValues,
    });

    const handleClienteSearchForm = (formData: SearchForm) => {

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
        router.push(`/dashboard/cliente/search?${queryString}`);
    };
    return (
        
        <form
            onSubmit={handleSubmit(handleClienteSearchForm)}
            className=" flex gap-3"
        >

            <input
                type="text"
                placeholder="Buscar Cliente por Nombre, Alias o Identificación... "
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

export default ClienteSearchForm
