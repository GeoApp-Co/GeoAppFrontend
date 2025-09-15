import { carTypeEnum } from "@/src/schemas";
import { NewCarForm } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type CarFormProps = {
    register: UseFormRegister<NewCarForm>;
    errors: FieldErrors<NewCarForm>;
};

function CarForm({ register, errors }: CarFormProps) {

    const carTypeOptions = carTypeEnum.options;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Placa */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">
                Placa del vehículo
                </label>
                <input
                type="text"
                {...register("plate", {
                    required: "La placa es obligatoria",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    maxLength: { value: 10, message: "Máximo 10 caracteres" },
                })}
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg uppercase"
                placeholder="Ej: ABC123"
                />
                {errors.plate && <ErrorMessage>{errors.plate.message}</ErrorMessage>}
            </div>

            {/* Tipo de carro */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">
                Tipo de carro
                </label>
                <select
                {...register("carType", { required: "El tipo de carro es obligatorio" })}
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                >
                <option value="">Elegir tipo de vehículo</option>
                {carTypeOptions.map((option) => (
                    <option key={option} value={option}>
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                    </option>
                ))}
                </select>
                {errors.carType && <ErrorMessage>{errors.carType.message}</ErrorMessage>}
            </div>
            </div>
    );
}

export default CarForm;
