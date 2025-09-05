import { NewCertificateType } from "@/src/types"
import Divider from "@/src/UI/Divider"
import { FieldErrors, UseFormRegister } from "react-hook-form"

type CertificateNewFormProps = {
    register: UseFormRegister<NewCertificateType>
    errors: FieldErrors<NewCertificateType>
}

function CertificateNewForm({ errors, register }: CertificateNewFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <p className="font-bold text-azul text-lg md:col-span-2">Formulario de Nuevo Certificado</p>

            {/* Campo No */}
            <div className="flex flex-col">
                <label className="text-azul font-bold block text-sm mb-1">
                    Número
                </label>
                <input
                    type="text"
                    {...register("No")}
                    className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        errors.No
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="Ingrese el número del certificado"
                />
                {errors.No && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.No.message?.toString()}
                    </p>
                )}
            </div>

            {/* Campo Certificate Type (Select) */}
            <div className="flex flex-col">
                <label className="text-azul font-bold block text-sm mb-1">
                    Tipo de Certificado
                </label>
                <select
                    {...register("certificateType")}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"

                >
                    <option value="">
                        Seleccione un tipo de certificado
                    </option>
                    <option value="CERTIFICADO DE GESTIÓN INTEGRAL DE RESIDUOS">
                        CERTIFICADO DE GESTIÓN INTEGRAL DE RESIDUOS
                    </option>
                    {/* si en el futuro hay más tipos, se agregan aquí */}
                </select>
                {errors.certificateType && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.certificateType.message?.toString()}
                    </p>
                )}
            </div>
        </div>
    )
}

export default CertificateNewForm
