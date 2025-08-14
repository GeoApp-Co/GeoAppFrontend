import { unidades } from "@/src/schemas";
import { Medidas, NewItemFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { traslateMedidas } from "@/src/utils";
import { FieldErrors, UseFormRegister } from "react-hook-form";
// Ajusta la ruta si es necesario

type ItemFormProps = {
    register: UseFormRegister<NewItemFormType>;
    errors: FieldErrors<NewItemFormType>;
};

function ItemForm({ errors, register }: ItemFormProps) {

    const opcionesMedida: Medidas[] = unidades.options;


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
            <label className="text-azul font-bold block text-sm mb-1">Tipo de Medida</label>
            <select
                {...register("unidad", {
                required: "Selecciona un tipo de Medida",
                })}
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
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

            
        </div>
    );
}

export default ItemForm