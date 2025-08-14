"use client"
import { login } from "@/src/api/authApi";
import { useAuth } from "@/src/hooks/useAuth";
import { LoginForm } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import Logo from "@/src/UI/Logo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function LoginPage() {

    const queryClient = useQueryClient()
    const router = useRouter()

    // const token = typeof window !== 'undefined' && localStorage.getItem('AUTH_TOKEN');

    const { isLoading, user, token} = useAuth()

    const initialValues : LoginForm = {
        cc: "",
        password: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: initialValues,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: login,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess() {
            queryClient.invalidateQueries({queryKey: ['user']})
            reset()
            router.replace('/');
            // redirect('/')
        },
    })

    const handleLogin = (dataForm : LoginForm ) => {
        mutate(dataForm)
    }

    useEffect(() => {
        if (!isLoading && user && token) {
            router.replace('/');
        }
    }, [user, isLoading, router, token]);


    if (!token) return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

            <Logo/>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Iniciar Sesión</h2>
            
            <form className="space-y-4"
                onSubmit={handleSubmit(handleLogin)}
            >
                
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identidicación</label>
                <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Número de Identificación"
                {...register('cc', {
                    required: 'La identificación es obligatorio',
                    pattern: {
                        value: /^[0-9]+$/, 
                        message: 'Solo se permiten números'
                    }
                })}
                />
                {errors.cc && <ErrorMessage>{errors.cc.message}</ErrorMessage>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input 
                    type="password" 
                    {...register('password', {
                        required: 'La contraseña es obligatoria'
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                />
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className={`w-full ${
                        isPending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white font-medium py-2.5 rounded-lg transition-colors`}
                >
                    {isPending ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            
            </form>


        </div>
        </div>
    )
}

export default LoginPage
