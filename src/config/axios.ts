import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
    baseURL: `${url}/api`
})

api.interceptors.request.use( config => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api;