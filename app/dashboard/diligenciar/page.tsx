"use client"

import ClientComboBox from "@/src/components/dashboard/manifiesto/newManifiesto/ClientComboBox"
import TemplateComboBox from "@/src/components/dashboard/manifiesto/newManifiesto/TemplateComboBox"
import { NewManifestFormType } from "@/src/types"
import Heading from "@/src/UI/Heading"
import DatePicker from "react-datepicker"
import { FormProvider, useForm, Controller } from "react-hook-form"
import "react-datepicker/dist/react-datepicker.css"
import ButtonImageUpload from "@/src/components/dashboard/manifiesto/newManifiesto/ButtonImageUpload"
import ButtonSignature from "@/src/components/dashboard/manifiesto/newManifiesto/ButtonSignature"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createManifest } from "@/src/api/manifestApi"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import { traslateRoles } from "@/src/utils"
import SelectCar from "@/src/components/dashboard/manifiesto/newManifiesto/SelectCar"

function NewManifestPage() {

    const queryClient = useQueryClient()
    const router = useRouter()
    const { user } = useAuth()

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const methods = useForm<NewManifestFormType>({
        defaultValues: {
            clientId: 0,
            manifestTemplateId: 0,
            plateId: 0,
            date: now,
            dateFinal: oneHourLater,
            observations: '',
            items: [],
            photos: [],
            signature: '',
            signatureClient: '',
            location: '',
            contactClient: '',
            positionClient: '',
            phone: '',
        }
    })

    const { register, control, watch} = methods

    const { photos } = watch()

    const { mutate, isPending } = useMutation({
        mutationFn: createManifest,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success("Manifiesto creado exitosamente!")
            queryClient.invalidateQueries({queryKey: ['manifests']})

            setTimeout(() => {
                router.push(`/dashboard/manifiesto/${data}/view`)
            }, 3000) // Espera 3 segundos
        }

    })

    
    const onSubmit = methods.handleSubmit((formData) => {

        const errors: string[] = []

        // Validar que no estén vacíos o en valores inválidos
        if (!formData.clientId || formData.clientId === 0) {
            errors.push("Debes seleccionar un cliente.")
        }
        
        if (!formData.manifestTemplateId || formData.manifestTemplateId === 0) {
            errors.push("Debes seleccionar una plantilla de manifiesto.")
        }
        if (!formData.plateId || formData.plateId === 0) {
            errors.push("Debes seleccionar una placa de vehículo.")
        }
        if (!formData.contactClient || formData.contactClient.trim() === "") {
            errors.push("La Nombre del contacto no puede estar vacío.")
        }
        if (!formData.positionClient || formData.positionClient.trim() === "") {
            errors.push("La posición del contacto no puedeestar vacio.")
        }

        if (!formData.signature || formData.signature.trim() === "") {
            errors.push("Debes incluir la firma del transportador.")
        }

        if (!formData.signatureClient || formData.signatureClient.trim() === "") {
            errors.push("Debes incluir la firma del cliente.")
        }

        if (!formData.photos || formData.photos.length === 0) {
            errors.push("Debes subir al menos una foto.")
        }

        if (!formData.items || formData.items.length === 0) {
            errors.push("Debes ingresar al menos un ítem con cantidad.")
        }

        if (formData.dateFinal <= formData.date) {
        errors.push("La fecha final debe ser posterior a la fecha inicial.");
        }

        // Si hay errores, retornar todos
        if (errors.length > 0) {
            errors.forEach((err) => toast.error(err))
            return
        }
        
        // Si todo está OK, enviar los datos
        mutate({ formData })
    })

    return (
        <>
        <Heading>Crear Manifiesto</Heading>

        <FormProvider {...methods}>
            <form
            onSubmit={onSubmit}
            className="flex flex-col gap-5 w-[80%]   max-w-5xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-md space-y-6 print:max-w-full print:shadow-none print:rounded-none print:p-2 print:space-y-2 print:text-[11px]"
            >
                
            <ClientComboBox />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">

                {/* Campo: Placa */}
                <SelectCar/>
                {/* <div>
                <label className="text-azul font-bold block text-sm mb-1">Placa del vehículo</label>
                <input
                    type="text"
                    {...register("plate")}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Placa del vehículo"
                />
                </div> */}

                {/* Campo: Ubicacón */}
                <div>
                <label className="text-azul font-bold block text-sm mb-1">Lugar</label>
                <input
                    type="text"
                    {...register("location")}
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Lugar del servicio"
                />
                </div>

                {/* Campo: Fecha con DatePicker */}
                <div>
                <label className="text-azul font-bold block text-sm mb-1">Fecha Inicial</label>
                <Controller
                    control={control}
                    name="date"
                    render={({ field }) => {
                        const { value, onChange } = field;
                        return (
                            <DatePicker
                                selected={value}
                                onChange={onChange}
                                showTimeSelect
                                dateFormat="dd/MM/yyyy HH:mm"
                                placeholderText="Seleccionar fecha y hora"
                                wrapperClassName="w-full"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            />
                        );
                    }}
                />
                </div>

                {/* Campo: Fecha final con DatePicker */}
                <div className="w-full">
                <label className="text-azul font-bold block text-sm mb-1">Fecha Final</label>
                <Controller
                    control={control}
                    name="dateFinal"
                    render={({ field }) => {
                        const { value, onChange } = field;
                        return (
                            <DatePicker
                                selected={value}
                                onChange={onChange}
                                showTimeSelect
                                dateFormat="dd/MM/yyyy HH:mm"
                                placeholderText="Seleccionar fecha y hora"
                                wrapperClassName="w-full"

                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            />
                        );
                    }}
                />
                </div>
            </div>

            <TemplateComboBox />

            <ButtonImageUpload 
                images={photos}
                setValue={methods.setValue}

            />

            {/* Campo: Observaciones */}
            <div className="md:col-span-2">
            <label className="text-azul font-bold block text-sm mb-1">Observaciones</label>
            <textarea
                {...register("observations")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white focus:border-indigo-500 outline-none transition-all"
                placeholder="Observaciones..."
                rows={4}
            />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Firma del Conductor</label>
                    <ButtonSignature
                        input={'signature'}
                    /> 
                    <div className="mt-3">
                        <label className="text-azul font-bold block text-sm mb-1">Nombre del diligenciador</label>
                        <input
                        type="text"
                        disabled={true}
                        value={user?.name || 'Sin Sesión Activa'}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Nombre del contacto"
                        />
                    </div>

                    <div className="mt-3">
                        <label className="text-azul font-bold block text-sm mb-1">Cargo del diligenciador</label>
                        <input
                        type="text"
                        value={traslateRoles(user?.rol.name || '')}
                        disabled={true}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Cargo del contacto"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Firma del Cliente</label>
                    <ButtonSignature input={'signatureClient'} />

                    <div className="mt-3">
                        <label className="text-azul font-bold block text-sm mb-1">Nombre del contacto del cliente</label>
                        <input
                        type="text"
                        {...register("contactClient")}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Nombre del contacto"
                        />
                    </div>

                    <div className="mt-3">
                        <label className="text-azul font-bold block text-sm mb-1">Cargo del contacto del cliente</label>
                        <input
                        type="text"
                        {...register("positionClient")}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Cargo del contacto"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="text-azul font-bold block text-sm mb-1">Teléfono del contacto del cliente</label>
                        <input
                        type="text"
                        {...register("phone")}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Teléfono del contacto"
                        />
                    </div>
                </div>
                
            </div>
            

        <button
            type="submit"
            disabled={isPending}
            className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde md:col-span-2 transition-colors ${
                isPending
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-lime-200 hover:text-verde'
            }`}
        >
            {isPending ? 'Creando...' : 'Crear Manifiesto'}
        </button>
            </form>
        </FormProvider>
        </>
    )
}

export default NewManifestPage