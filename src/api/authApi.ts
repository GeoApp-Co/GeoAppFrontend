import { isAxiosError } from "axios";
import api from "../config/axios";
import { LoginForm } from "../types";
import { userSchema } from "../schemas";

export async function login(formData: LoginForm) {
    try {
        const url = '/auth/login'
        const {data} = await api.post(url, formData)
        
        localStorage.setItem('AUTH_TOKEN', data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api.get('/users');
        const response = userSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error al obtener el usuario.");
        }
    }
}