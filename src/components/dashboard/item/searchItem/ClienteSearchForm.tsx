"use client"
import { itemCategoryEnum } from "@/src/schemas";
import { SearchItemForm } from "@/src/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function ItemSearchForm() {
    
    const router = useRouter()

    const categoryValues = itemCategoryEnum.options; 

    const initialValues : SearchItemForm = {
        search: '',
        categoria: undefined
    }

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: initialValues,
    });

    const handleItemSearchForm = (formData: SearchItemForm) => {
        const { search, categoria } = formData;

        const sinSearch = !search?.trim() && !categoria;

        if (sinSearch) {
        toast.error("Debe ingresar un valor para la búsqueda");
        return;
        }

        const queryParams = new URLSearchParams();

        if (search?.trim()) queryParams.append("search", search.trim());
        if (categoria) queryParams.append("categoria", categoria);

        router.push(`/dashboard/item/search?${queryParams.toString()}`);
    };
    
    return (
        
        <form
            onSubmit={handleSubmit(handleItemSearchForm)}
            className=" flex gap-3 md:col-span-2"
        >

            <input
                type="text"
                placeholder="Buscar Item por Nombre o Código..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                {...register('search')}
            />

            <select
                {...register('categoria')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
                <option value="">Todas las categorías</option>
                {categoryValues.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <input 
                type="submit" 
                value={'Buscar'}
                className="bg-verde w-full lg:w-auto text-xl  px-4 py-2 text-center font-bold cursor-pointer text-white rounded-xl hover:bg-lime-200 hover:text-verde  border-verde"
            />

        </form>
        
    )
}

export default ItemSearchForm
