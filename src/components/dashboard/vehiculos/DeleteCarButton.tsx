import { deleteCar } from "@/src/api/carApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

function DeleteCarButton( { carId } : { carId : number }) {

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: deleteCar,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess(data) {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['cars']})
        },
    })

    const handleDeleteCar = (carId : number)  => {
        mutate({carId: carId.toString()})
    }

    return (
        <button
            onClick={() => handleDeleteCar(carId)}
            disabled={isPending}
            className={`px-3 py-1 text-sm text-white rounded transition-colors
                ${isPending 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-500"
                }`}
        >
            Eliminar
        </button>

    )
}

export default DeleteCarButton
