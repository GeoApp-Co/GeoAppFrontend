import { z } from 'zod';
import { roles } from '../schemas';
import { Medidas } from '../types';

type ValidRole = z.infer<typeof roles>;

export const traslateMedidas = (unidad: Medidas) => {
    const traducciones: Record<Medidas, string> = {
        kg: "Kilogramos",
        litro: "Litros",
        unidad: "Unidad",
        hora: "Hora"
    };
    return traducciones[unidad];
};

export const formatDateTimeLarge = (dateString: string): string => {
    const date = new Date(dateString);

    const formatterDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const formatterTime = new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const formattedDate = formatterDate.format(date);
    const formattedTime = formatterTime.format(date);

    return `${formattedDate}, ${formattedTime}`;
};

export function formatNumber(num: number) {
    const digito = 5;
    const numStr = num.toString();
    if (numStr.length < digito) {
        return numStr.padStart(digito, '0');
    }
    return numStr;
}

export const traslateRoles = (rolName: string): string => {
    const validRoles: ValidRole[] = roles.options;

    const role = validRoles.find(role => role === rolName);

    if (role) {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'superAdmin':
                return 'Super Administrador';
            case 'conductor':
                return 'Conductor';
            case 'comercio':
                return 'Comercio';
            default:
                return `Rol desconocido (${role})`;
        }
    } else {
        return `Rol desconocido (${rolName})`;
    }
};

// Función para transformar y validar la cantidad
export const transformAndValidateQuantity = (value: string): number | null => {
    // Elimina espacios en blanco al inicio y al final de la cadena
    const trimmedValue = value.trim();

    // Reemplaza comas por puntos y puntos por puntos (para evitar problemas si ya hay un punto)
    const cleanedValue = trimmedValue.replace(",", ".").replace(".", ".");

    const parsedValue = parseFloat(cleanedValue);


    // Verifica si el valor es un número válido y mayor o igual a cero.
    if (isNaN(parsedValue) || parsedValue < 0) {
        return null; // Retorna null si no es un número válido o es negativo
    }

    return parsedValue;
};

