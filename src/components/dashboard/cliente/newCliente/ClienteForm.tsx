import { NewClientFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { FieldErrors, UseFormRegister } from "react-hook-form";
// Ajusta la ruta si es necesario

type ClienteFormProps = {
    register: UseFormRegister<NewClientFormType>;
    errors: FieldErrors<NewClientFormType>;
};

function ClienteForm({ errors, register }: ClienteFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Nombre</label>
                <input
                    type="text"
                    {...register("name", {
                        required: "El nombre es obligatorio",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre del cliente"
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </div>

            {/* Alias */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Alias</label>
                <input
                    type="text"
                    {...register("alias", {
                        required: "El alias es obligatorio",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Alias"
                />
                {errors.alias && <ErrorMessage>{errors.alias.message}</ErrorMessage>}
            </div>

            {/* Tipo de identificación */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Tipo de identificación</label>
                <select
                    {...register("identificacionType", {
                        required: "Selecciona un tipo de identificación",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Selecciona una opción</option>
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="nit">NIT</option>
                </select>
                {errors.identificacionType && <ErrorMessage>{errors.identificacionType.message}</ErrorMessage>}
            </div>

            {/* Número de identificación */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Identificación</label>
                <input
                    type="text"
                    {...register("identificacion", {
                        required: "La identificación es obligatoria",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Número de identificación"
                />
                {errors.identificacion && <ErrorMessage>{errors.identificacion.message}</ErrorMessage>}
            </div>

            {/* Email */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Correo electrónico</label>
                <input
                    type="email"
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Correo electrónico no válido",
                        },
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Correo electrónico"
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            {/* Contacto */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Persona de contacto</label>
                <input
                    type="text"
                    {...register("contacto", {
                        required: "El nombre del contacto es obligatorio",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre del contacto"
                />
                {errors.contacto && <ErrorMessage>{errors.contacto.message}</ErrorMessage>}
            </div>

            {/* Teléfono */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Teléfono</label>
                <input
                    type="tel"
                    {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números",
                        },
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Teléfono"
                />
                {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
            </div>

            {/* Ubicación */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Ubicación</label>
                <input
                    type="text"
                    {...register("ubicacion", {
                        required: "La ubicación es obligatoria",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Departamento o ciudad"
                />
                {errors.ubicacion && <ErrorMessage>{errors.ubicacion.message}</ErrorMessage>}
            </div>
        </div>
    );
}

export default ClienteForm