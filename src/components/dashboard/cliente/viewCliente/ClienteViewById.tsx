"use client"

import { getClienteById } from "@/src/api/clientApi"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import ClientCard from "../../manifiesto/ClientCard"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import GoBackButton from "@/src/UI/GoBackButton"

type  ClienteViewByIdProps = {
    id: string
}

function ClienteViewById( { id } : ClienteViewByIdProps) {

    const { data, isLoading } = useQuery({
        queryKey:[ 'cliente', id],
        queryFn: () => getClienteById({clienteId: id})
    })

    if (isLoading) return <LoaderPage/>
    
    if (!data && !isLoading) {
        notFound()
    }
        

    return (
        <div className="max-w-4xl mx-auto mt-10 p-3 bg-white shadow-lg rounded-md space-y-3">
        
        <div className="flex justify-between">

            <span></span>
            <GoBackButton/> 

        </div>


        {data &&
            <Disclosure as="div" defaultOpen className="">
                <DisclosureButton
                    className="group flex w-full items-center justify-between"
                >
                    <span className="py-2 text-left w-full font-medium text-azul">Datos del Cliente</span>
                    <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                    <ClientCard cliente={data}/>
                </DisclosurePanel>
            </Disclosure>
        }

        <Disclosure as="div" className="" defaultOpen>
            <DisclosureButton
                className="group flex w-full items-center justify-between"
            >
                <span className="py-2 text-left w-full font-medium text-azul">Servicios Prestados</span>
                <ChevronDownIcon className="size-5 fill-azul/60 group-data-hover:fill-azul/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
                <p>lista de manifiestos</p>
                
            </DisclosurePanel>
        </Disclosure>


        </div>
    )
}

export default ClienteViewById
