import { z } from 'zod';
import { identificacionType, personaType, roles } from '../schemas';
import { Medidas } from '../types';

type ValidRole = z.infer<typeof roles>;
type PersonType = z.infer<typeof personaType>;
type IdentificacionType = z.infer<typeof identificacionType>;

// Traducción de tipo de persona
export const translatePersonaType = (type: PersonType): string => {
    const map: Record<PersonType, string> = {
        natural: "Natural",
        juridica: "Jurídica",
    };
    return map[type] ?? type;
};

// Traducción de tipo de identificación (LARGO)
export const translateIdentificacionTypeLong = (type: IdentificacionType): string => {
    const map: Record<IdentificacionType, string> = {
        cc: "Cédula de ciudadanía",
        ti: "Tarjeta de identidad",
        ce: "Cédula de extranjería",
        nit: "Número de identificación tributaria",
        rc: "Registro civil",
        pa: "Pasaporte",
        pep: "Permiso especial de permanencia",
        diplomatico: "Carné diplomático",
        sinIdentificacion: "Documento extranjero sin identificación local",
    };
    return map[type] ?? type.toUpperCase();
};

// Traducción de tipo de identificación (CORTO)
export const translateIdentificacionTypeShort = (type: IdentificacionType): string => {
    const map: Record<IdentificacionType, string> = {
        cc: "CC",
        ti: "TI",
        ce: "CE",
        nit: "NIT",
        rc: "RC",
        pa: "PA",
        pep: "PEP",
        diplomatico: "DIP",
        sinIdentificacion: "SIN-ID",
    };
    return map[type] ?? type.toUpperCase();
};


export const traslateMedidas = (unidad: Medidas) => {
    const traducciones: Record<Medidas, string> = {
        kg: "Kilogramos",
        litro: "Litros",
        unidad: "Unidad",
        hora: "Hora",
        galones: "Galones",
        m3: "Metro Cúbico"
    };
    return traducciones[unidad];
};

export const translateMedidasSimbolos = (unidad: Medidas): string => {
    const simbolos: Record<Medidas, string> = {
        kg: "KG",
        litro: "LT",
        unidad: "UND",
        hora: "HR",
        galones: "GAL",
        m3: "M³"
    };
    return simbolos[unidad] || unidad;
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
            case 'factura':
                return 'Facturación';
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

