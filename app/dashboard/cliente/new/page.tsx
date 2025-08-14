"use client"
import { createClient } from "@/src/api/clientApi"
import ClienteForm from "@/src/components/dashboard/cliente/newCliente/ClienteForm"
import { NewClientFormType } from "@/src/types"
import GoBackButton from "@/src/UI/GoBackButton"
import Heading from "@/src/UI/Heading"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

function NewClientePage() {

    const queryClient = useQueryClient()
    const router = useRouter()

    const initialValues : NewClientFormType = {
        alias: '',
        contacto: '',
        email: '',
        identificacion: '',
        name: '',
        telefono: '',
        ubicacion: '',
        identificacionType: 'nit'
    }

    const { register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: createClient,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success("Cliente creado exitosamente!")
            queryClient.invalidateQueries({queryKey: ['clientes']})

            setTimeout(() => {
                router.push(`/dashboard/cliente/${data}/view`)
            }, 3000) // Espera 3 segundos
        }
    })

    const handleCreateClient = (formData : NewClientFormType) => {
        mutate({formData})
    }

    return (
        <div className="w-[80%] max-w-3xl mx-auto">

        <Heading>Crear Cliente</Heading>

        <div className="flex flex-col md:flex-row justify-between my-5 gap-5 items-center">
            <p className="font-semibold  text-azul text-xl md:text-right text-center">Formulario para crear un cliente</p>

            <GoBackButton/>
        </div>

        <form 
            onSubmit={handleSubmit(handleCreateClient)}
            className="flex flex-col gap-5 mt-5"
        >
            <ClienteForm 
                register={register}
                errors={errors}
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
            {isPending ? 'Creando...' : 'Crear Nuevo Cliente'}
        </button>
        </form>

        
        </div>
    )
}

export default NewClientePage
