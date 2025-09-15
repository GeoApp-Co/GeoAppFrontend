"use client"

import { getItemsById, updateItem } from "@/src/api/itemApi"
import { NewItemFormType } from "@/src/types"
import GoBackButton from "@/src/UI/GoBackButton"
import Heading from "@/src/UI/Heading"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ItemForm from "../newItem/ItemForm"

type  ItemEditProps = {
    id: string
}

function ItemEdit( { id } : ItemEditProps) {

    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey:[ 'item', id],
        queryFn: () => getItemsById({itemId: id})
    })

    const initialValues : NewItemFormType = {
        code: '',
        name: '',
        unidad: 'kg',
        categoria: 'OTRO'
    }

    const { register, handleSubmit, formState: {errors}, reset, setValue, watch} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: updateItem,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Item actualizado exitosamente!")
            queryClient.invalidateQueries({queryKey: ['item', id]})
            queryClient.invalidateQueries({queryKey: ['items']})
        }
    })

    const handleItemClient = (formData : NewItemFormType) => {
        mutate({formData, itemId: id})
    }

    useEffect(() => {
        if (data) {
            reset({
                code: data.code || '',
                name: data.name || '',
                unidad: data.unidad || 'kg',
                categoria: data.categoria || 'OTRO'
            })
        }
    }, [data, reset])


    if (isLoading) return <LoaderPage/>
    
    if (!data && !isLoading) {
        notFound()
    }
    
    return (
        <div className="w-[80%] max-w-3xl mx-auto">

        <Heading>Actualizar Item</Heading>

        <div className="flex flex-col md:flex-row justify-between my-5 gap-5 items-center">
            <p className="font-semibold  text-azul text-xl md:text-right text-center">Formulario para actualizar un item</p>

            <GoBackButton/>
        </div>

        <form 
            onSubmit={handleSubmit(handleItemClient)}
            className="flex flex-col gap-5 mt-5"
        >
            <ItemForm
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
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
            {isPending ? 'Actualizando...' : 'Actualizar Item'}
        </button>
        </form>

        
        </div>
    )
}

export default ItemEdit
