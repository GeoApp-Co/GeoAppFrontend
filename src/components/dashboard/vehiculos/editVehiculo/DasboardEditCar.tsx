"use client"
import GoBackButtonMUI from "@/src/UI/GoBackButtonMUI"
import Heading from "@/src/UI/Heading"
import CarForm from "../CartForm"
import { useForm } from "react-hook-form"
import { NewCarForm } from "@/src/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCarById, updateCar } from "@/src/api/carApi"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { notFound, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@mui/material"
import { toast } from "react-toastify"

function DashboardEditCar( { id } : { id: string}) {

    const router = useRouter()

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['car', id],
        queryFn: () => getCarById({carId: id}),
        enabled: !!id
    })

    const initialValues : NewCarForm = {
        carType: 'CAMIONETA',
        plate: ''
    }

    const { handleSubmit, register, formState: {errors}, reset} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending } = useMutation({
        mutationFn: updateCar,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess(data) {
            toast.success(data)
            refetch()
            router.push('/dashboard/vehiculos')
        }
    })

    const handleEditCar = (formData : NewCarForm) => {
        mutate({formData, carId: id})
    }

    useEffect(() => {
        if (data) {
            reset({
                carType: data.carType || 'CAMIONETA',
                plate: data.plate || ''
            })
        }
    }, [data, reset])
    

    if (isLoading) return <LoaderPage/>

    if (isError) return notFound()

    return (
        <section className="bg-white p-3 h-full">

            <Heading>Agregar Nuevo Vehículo</Heading>
            <form 
                className="w-3xl mx-auto"
                onSubmit={handleSubmit(handleEditCar)}
            >
                <div className="mt-3 flex justify-between items-center">
                    <h2 className="text-lg text-azul">
                        Formulario para actualizar un vehículo
                    </h2>
                    <GoBackButtonMUI />
                </div>

                <CarForm
                    errors={errors}
                    register={register}
                />

                <div className="mt-6 flex justify-center">
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        size="large"
                        disabled={isPending}
                    >
                        Guardar nuevo vehículo
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default DashboardEditCar
