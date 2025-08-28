import { ClienteType } from '@/src/types'
import { translateIdentificacionTypeShort, translatePersonaType } from '@/src/utils'
import React from 'react'

type ClientCardProps = {
    cliente: ClienteType
}

function ClientCard( { cliente} : ClientCardProps ) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-700">  
            <div><strong>Cliente:</strong> {cliente.name}</div>
            <div><strong>Alias:</strong> {cliente.alias}</div>
            <div><strong>Tipo de Persona:</strong> {translatePersonaType(cliente.personaType)}</div>
            <div><strong>Identificación:</strong> <span >{translateIdentificacionTypeShort(cliente.identificacionType)}</span> {cliente.identificacion}</div>
            <div><strong>Correo:</strong> {cliente.email}</div>
            <div><strong>Ubicación:</strong> {cliente.ubicacion}</div>
            <div><strong>Dirección:</strong> {cliente.direccion}</div>
        </div>
    )
}

export default ClientCard
