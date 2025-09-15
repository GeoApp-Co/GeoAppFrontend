"use client"
import { NewCarForm } from '@/src/types'
import GoBackButtonMUI from '@/src/UI/GoBackButtonMUI'
import Heading from '@/src/UI/Heading'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import CarForm from '../CartForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCar } from '@/src/api/carApi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

function DashboardNewCar() {
    
    const queryClient = useQueryClient()
    const router = useRouter()

    const initialValues : NewCarForm = {
        carType: 'CAMIONETA',
        plate: ''
    }

    const { handleSubmit, register, formState: {errors} } = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: createCar,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess(data) {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['cars']})
            router.push('/dashboard/vehiculos')
        },
    })


    const handleCreateCar = (formData : NewCarForm ) => {
        mutate({formData})
    }

    return (
        <section className="bg-white p-3 h-full">
            <Heading>Agregar Nuevo Vehículo</Heading>

            <form 
                className="w-3xl mx-auto"
                onSubmit={handleSubmit(handleCreateCar)}
            >
                <div className="mt-3 flex justify-between items-center">
                    <h2 className="text-lg text-azul">
                        Formulario para agregar un vehículo nuevo
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

export default DashboardNewCar
