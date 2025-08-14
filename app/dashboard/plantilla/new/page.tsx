"use client"
import { createTemplate } from "@/src/api/templateApi"
import TemplateForm from "@/src/components/dashboard/template/newTemplate/TemplateForm"
import { NewTemplateFormType } from "@/src/types"
import GoBackButton from "@/src/UI/GoBackButton"
import Heading from "@/src/UI/Heading"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

function NewTemplatePage() {

    const queryClient = useQueryClient()
    const router = useRouter()

    const initialValues : NewTemplateFormType = {
        name: '',
        itemIds: []
    }

    const { register, handleSubmit, formState: {errors}, setValue} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: createTemplate,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success("Plantilla creada exitosamente!")
            queryClient.invalidateQueries({queryKey: ['templates']})

            setTimeout(() => {
                router.push(`/dashboard/plantilla/${data}/view`)
            }, 3000) // Espera 3 segundos
        }
    })

    const handleCreateTemplate = (formData : NewTemplateFormType) => {

        if (formData.itemIds.length === 0) {
            toast.error("Debe seleccionar al menos un ítem.");
            return; // Detener la creación si no hay ítems seleccionados
        }

        mutate({formData})
    }

    return (
        <div className="w-[80%] max-w-3xl mx-auto">

        <Heading>Crear Plantilla</Heading>

        <div className="flex flex-col md:flex-row justify-between my-5 gap-5 items-center">
            <p className="font-semibold  text-azul text-xl md:text-right text-center">Formulario para crear una Plantilla de Manifiesto</p>

            <GoBackButton/>
        </div>

        <form 
            onSubmit={handleSubmit(handleCreateTemplate)}
            className="flex flex-col gap-5 mt-5"
        >
            <TemplateForm
                register={register}
                errors={errors}
                setValue={setValue}
                initialItems={[]}
            />

            <button
            type="submit"
            disabled={isPending}
            className={`bg-verde w-full lg:w-auto text-xl px-4 py-2 text-center font-bold text-white rounded-xl border-verde md:col-span-2 transition-colors ${
                isPending
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-lime-200 hover:text-verde'
            }`}
        >
            {isPending ? 'Creando...' : 'Crear Nueva Plantilla'}
        </button>
        </form>

        
        </div>
    )
}

export default NewTemplatePage
