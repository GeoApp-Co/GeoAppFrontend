import { ClienteType } from '@/src/types'
import React from 'react'

type ClientCardProps = {
    cliente: ClienteType
}

function ClientCard( { cliente} : ClientCardProps ) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-700">  
            <div><strong>Cliente:</strong> {cliente.name}</div>
            <div><strong>Alias:</strong> {cliente.alias}</div>
            <div><strong>Identificación:</strong> <span className="uppercase">{cliente.identificacionType}</span> {cliente.identificacion}</div>
            <div><strong>Contacto:</strong> {cliente.contacto}</div>
            <div><strong>Correo:</strong> {cliente.email}</div>
            <div><strong>Télefono:</strong> {cliente.telefono}</div>
            <div><strong>Ubicación:</strong> {cliente.ubicacion}</div>
            
        </div>
    )
}

export default ClientCard
