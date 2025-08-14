"use client"
import { getTemplateById, updateTemplate } from "@/src/api/templateApi"
import { NewTemplateFormType } from "@/src/types"
import GoBackButton from "@/src/UI/GoBackButton"
import Heading from "@/src/UI/Heading"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import TemplateForm from "../newTemplate/TemplateForm"

type  TemplateEditProps = {
    id: string
}

function TemplateEdit( { id } : TemplateEditProps) {

    const queryClient = useQueryClient()

    const initialValues : NewTemplateFormType = {
        name: '',
        itemIds: []
    }

    const { data, isLoading } = useQuery({
        queryKey: ["template", id],
        queryFn: () => getTemplateById({ templateId: id }),
        enabled: !!id,
    });

    const { register, handleSubmit, formState: {errors}, setValue, reset} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: updateTemplate,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['templates']})
            queryClient.invalidateQueries({queryKey: ['template', id ]})

        }
    })

    const handleUpdateTemplate = (formData : NewTemplateFormType) => {

        if (formData.itemIds.length === 0) {
            toast.error("Debe seleccionar al menos un ítem.");
            return; // Detener la creación si no hay ítems seleccionados
        }

        // console.log(formData);
        

        mutate({formData, templateId: id})
    }

    useEffect(() => {
        if (data) {
            reset({
                name: data.name || '',
                itemIds: data.items.map( i => i.id)
            })
        }
    }, [data, reset])

    if (isLoading) return <LoaderPage />;

    if (!data && !isLoading) {
        notFound();
    }

    return (
        <div className="w-[80%] max-w-3xl mx-auto">

        <Heading>Editar Plantilla</Heading>

        <div className="flex flex-col md:flex-row justify-between my-5 gap-5 items-center">
            <p className="font-semibold  text-azul text-xl md:text-right text-center">Formulario para crear una Plantilla de Manifiesto</p>

            <GoBackButton/>
        </div>

        <form 
            onSubmit={handleSubmit(handleUpdateTemplate)}
            className="flex flex-col gap-5 mt-5"
        >
            <TemplateForm
                register={register}
                errors={errors}
                setValue={setValue}
                initialItems={data ? data.items : []}
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
            {isPending ? 'Creando...' : 'Actualizar Nueva Plantilla'}
        </button>
        </form>

        
        </div>
    )
}

export default TemplateEdit
