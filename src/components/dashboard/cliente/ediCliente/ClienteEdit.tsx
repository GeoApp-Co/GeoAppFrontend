"use client"

import { getClienteById, updateClient } from "@/src/api/clientApi"
import { NewClientFormType } from "@/src/types"
import GoBackButton from "@/src/UI/GoBackButton"
import Heading from "@/src/UI/Heading"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ClienteForm from "../newCliente/ClienteForm"

type  ClienteEditProps = {
    id: string
}

function ClienteEdit( { id } : ClienteEditProps) {

    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey:[ 'cliente', id],
        queryFn: () => getClienteById({clienteId: id})
    })

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

    const { register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: updateClient,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Cliente actualizado exitosamente!")
            queryClient.invalidateQueries({queryKey: ['cliente', id]})
            queryClient.invalidateQueries({queryKey: ['clientes']})
        }
    })

    const handleUpdateClient = (formData : NewClientFormType) => {
        mutate({formData, clienteId: id})
    }

    useEffect(() => {
        if (data) {
            reset({
                alias: data.alias || '',
                contacto: data.contacto || '',
                email: data.email || '',
                identificacion: data.identificacion || '',
                name: data.name || '',
                telefono: data.telefono || '',
                ubicacion: data.ubicacion || '',
                identificacionType: data.identificacionType || 'nit'
            })
        }
    }, [data, reset])


    if (isLoading) return <LoaderPage/>
    
    if (!data && !isLoading) {
        notFound()
    }
    
    return (
        <div className="w-[80%] max-w-3xl mx-auto">

        <Heading>Actualizar Cliente</Heading>

        <div className="flex flex-col md:flex-row justify-between my-5 gap-5 items-center">
            <p className="font-semibold  text-azul text-xl md:text-right text-center">Formulario para actualizar un cliente</p>

            <GoBackButton/>
        </div>

        <form 
            onSubmit={handleSubmit(handleUpdateClient)}
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
            {isPending ? 'Actualizando...' : 'Actualizar Cliente'}
        </button>
        </form>

        
        </div>
    )
}

export default ClienteEdit
