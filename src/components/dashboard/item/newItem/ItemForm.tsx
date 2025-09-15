import { itemCategoryEnum, unidades } from "@/src/schemas";
import { Medidas, NewItemFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { traslateMedidas } from "@/src/utils";
import { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
// Ajusta la ruta si es necesario

type ItemFormProps = {
    register: UseFormRegister<NewItemFormType>;
    errors: FieldErrors<NewItemFormType>;
    watch: UseFormWatch<NewItemFormType>
    setValue: UseFormSetValue<NewItemFormType>
};

function ItemForm({ errors, register, watch, setValue}: ItemFormProps) {

    const opcionesMedida: Medidas[] = unidades.options;
    
    const categoryValues = itemCategoryEnum.options; 

    const selectedCategory = watch('categoria');

    useEffect(() => {
        if (((selectedCategory === "SERVICIO") || (selectedCategory === 'ESPECIAL') )&& setValue) {
            setValue("unidad", "unidad");
        }
    }, [selectedCategory, setValue]);

    const isServicio = (selectedCategory === "SERVICIO") || (selectedCategory === 'ESPECIAL')

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Código</label>
                <input
                    type="text"
                    {...register("code", {
                        required: "El código es obligatorio",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Código del Item"
                />
                {errors.code && <ErrorMessage>{errors.code.message}</ErrorMessage>}
            </div>

            <div>
                <label className="text-azul font-bold block text-sm mb-1">Nombre</label>
                <input
                    type="text"
                    {...register("name", {
                        required: "El Nombre es obligatorio",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre del Item"
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </div>

            <div>
                <label className="text-azul font-bold block text-sm mb-1">Categoria</label>
                <select
                    {...register('categoria', {
                    required: 'La categoria es obligatoria'
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Todas las categorías</option>
                    {categoryValues.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>


            <div>
            <label className="text-azul font-bold block text-sm mb-1">Tipo de Medida</label>
            <select
                {...register("unidad", {
                    required: "Selecciona un tipo de Medida",
                })}
                disabled={isServicio}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    isServicio 
                        ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                        : 'bg-white'
                }`}
            >
                <option value="">Selecciona una opción</option>
                {opcionesMedida.map((opcion) => (
                <option key={opcion} value={opcion}>
                    {traslateMedidas(opcion)}
                </option>
                ))}
            </select>
            {errors.unidad && <ErrorMessage>{errors.unidad.message}</ErrorMessage>}
            </div>

            {/* Mensaje informativo para categoría ESPECIAL */}
            {selectedCategory === "ESPECIAL" && (
                <p className="text-sm text-gray-600 mt-1 p-3 col-span-2">
                Al elegir la categoría <span className="font-semibold">ESPECIAL</span>, se agregarán automáticamente los campos <span className="font-semibold">Volumen de desechos</span>, <span className="font-semibold"># Viajes</span> y <span className="font-semibold"># Horas</span>.
                </p>
            )}

            
        </div>
    );
}

export default ItemForm