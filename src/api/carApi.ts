import { isAxiosError } from "axios";
import api from "../config/axios";
import { CarSchema, responseCarsSchema } from "../schemas";
import { NewCarForm } from "../types";


type CarType  ={
    carType?: string
    plate?: string
    formData: NewCarForm
    carId: string
}

export async function getCars( { carType, plate } : Pick<CarType, 'carType' | 'plate'>) {
    try {
        const url = '/cars'
        const { data } = await api.get(url, {params: {
            carType,
            plate
        }})

        const response = responseCarsSchema.safeParse(data)

        if (response.success) {
            return response.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getCarById( { carId } : Pick<CarType, 'carId'>) {
    try {
        const url = `/cars/${carId}`
        const { data } = await api.get(url)

        const response = CarSchema.safeParse(data)
        console.log(response.error);
        

        if (response.success) {
            return response.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function createCar( { formData } : Pick<CarType, 'formData'>) {
    try {
        const url = '/cars'
        const { data } = await api.post<string>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateCar( { formData, carId} : Pick<CarType, 'formData' | 'carId'>) {
    try {
        const url = `/cars/${carId}`
        const { data } = await api.put<string>(url, formData)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteCar( { carId} : Pick<CarType,  'carId'>) {
    try {
        const url = `/cars/${carId}`
        const { data } = await api.delete<string>(url)

        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}