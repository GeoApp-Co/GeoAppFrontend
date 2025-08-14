"use client"
import { SearchForm } from "@/src/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function UserSearchForm() {
    
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

    const handleUserSearchForm = (formData: SearchForm) => {

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
        router.push(`/dashboard/usuario/search?${queryString}`);
    };
    return (
        
        <form
            onSubmit={handleSubmit(handleUserSearchForm)}
            className=" flex gap-3"
        >

            <input
                type="text"
                placeholder="Buscar Usuario por Nombre o Identificación..."
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

export default UserSearchForm
