import { NewClientFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
// Ajusta la ruta si es necesario

type ClienteFormProps = {
    watch: UseFormWatch<NewClientFormType>
    register: UseFormRegister<NewClientFormType>;
    errors: FieldErrors<NewClientFormType>;
};

function ClienteForm({ errors, register, watch }: ClienteFormProps) {

    const tipoPersona = watch('personaType');
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

            {/* Contacto */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Contacto</label>
                <input
                    type="text"
                    {...register("contacto", {
                        required: "El contacto es obligatorio",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre del contacto principal"
                />
                {errors.contacto && <ErrorMessage>{errors.contacto.message}</ErrorMessage>}
            </div>

            {/* Tipo de identificación */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Tipo de identificación</label>
                <select
                    {...register("identificacionType", {
                        required: "Selecciona un tipo de identificación",
                        validate: (value) =>
                            tipoPersona === "juridica" && value !== "nit"
                                ? "Las personas jurídicas solo pueden tener NIT"
                                : true,
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Selecciona una opción</option>
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="nit">NIT</option>
                    <option value="ti">Tarjeta de identidad</option>
                    <option value="ce">Cédula de extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
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

             {/* Tipo de persona */}
            <div>
                <label className="text-azul font-bold block text-sm mb-1">Tipo de persona</label>
                <select
                    {...register("personaType", {
                        required: "Selecciona el tipo de persona",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Selecciona una opción</option>
                    <option value="natural">Persona Natural</option>
                    <option value="juridica">Persona Jurídica</option>
                </select>
                {errors.personaType && <ErrorMessage>{errors.personaType.message}</ErrorMessage>}
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

            {/* Teléfono 1 */}
            <div >
                <label className="text-azul font-bold block text-sm mb-1">Primer Teléfono</label>
                <input
                    type="text"
                    {...register("phone1", {
                        required: "El Primer teléfono es obligatoria",
                        pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "El teléfono solo puede contener números, espacios, guiones, paréntesis y el signo +"
                    },
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Primer Teléfono"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            {/* Teléfono 2*/}
            <div >
                <label className="text-azul font-bold block text-sm mb-1">Segundo Teléfono</label>
                <input
                    type="text"
                    {...register("phone2", {
                        required: "El Segundo teléfono es obligatoria",
                        pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "El teléfono solo puede contener números, espacios, guiones, paréntesis y el signo +"
                    },
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Segundo Teléfono"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
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

            {/* Dirección */}
            <div >
                <label className="text-azul font-bold block text-sm mb-1">Dirección</label>
                <input
                    type="text"
                    {...register("direccion", {
                        required: "La dirección es obligatoria",
                    })}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Dirección exacta"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            
        </div>
    );
}

export default ClienteForm