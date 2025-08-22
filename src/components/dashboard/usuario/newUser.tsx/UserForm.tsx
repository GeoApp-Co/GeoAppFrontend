"use client"
import { roles } from "@/src/schemas";
import { NewUserFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { traslateRoles } from "@/src/utils";
import { FieldErrors, UseFormRegister } from "react-hook-form";


type UserFormProps = {
    register: UseFormRegister<NewUserFormType>;
    errors: FieldErrors<NewUserFormType>;
    isEdit?: boolean
};

function UserForm({ errors, register, isEdit}: UserFormProps) {
    const rolesArray = roles.options;

    return (
        <div> {/* Envía los datos al onSubmit */}
            <div className="grid grid-cols-1 gap-4">

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Nombre</label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "El Nombre es obligatorio",
                        })}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Nombre del usuario"
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Identificación</label>
                    <input
                        type="text"
                        {...register("cc", {
                            required: "La Identificación es obligatoria",
                        })}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Identificación del usuario"
                    />
                    {errors.cc && <ErrorMessage>{errors.cc.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Contraseña</label>
                    <input
                        type="text"
                        {...register("password", {
                            ...(isEdit ? {} : { required: "La contraseña es obligatoria" }),
                            minLength: { value: 4, message: "La contraseña debe tener al menos 4 caracteres" },
                        })}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Contraseña del Usuario"
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                
                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Rol</label>
                    <select
                        {...register("roleName", { required: "El rol es obligatorio" })}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Selecciona un rol</option> 
                        {rolesArray.map((role) => (
                            <option key={role} value={role}>
                                {traslateRoles(role)}
                            </option>
                        ))}
                    </select>
                    {errors.roleName && <ErrorMessage>{errors.roleName.message}</ErrorMessage>}
                </div>
                
                

            </div>
        </div>
    );
}

export default UserForm;
