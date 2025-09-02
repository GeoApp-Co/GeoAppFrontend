import { z } from 'zod';

export const roles = z.enum(["admin", "superAdmin", "conductor", "comercio", "factura", 'operacion'])
export const unidades = z.enum(["litro", "kg", "unidad", 'hora', 'galones', 'm3'])
export const identificacionType = z.enum([
    "cc",              // Cédula de ciudadanía
    "ti",              // Tarjeta de identidad
    "ce",              // Cédula de extranjería
    "nit",             // Número de identificación tributaria
    "rc",              // Registro civil
    "pa",              // Pasaporte
    "pep",             // Permiso especial de permanencia
    "diplomatico",     // Carné diplomático
    "sinIdentificacion"// Documento extranjero sin identificación local
]);
export const itemCategoryEnum = z.enum([
    "RESIDUOS ESPECIALES",
    "RESIDUOS DE APROVECHAMIENTO",
    "RESIDUOS ORDINARIOS",
    "RESIDUOS HOSPITALARIOS",
    "RESIDUOS PELIGROSOS SOLIDOS",
    "RESIDUOS LIQUIDOS",
    "SUMINISTRO",
    "OTRO"
]);

export const personaType = z.enum(["natural", "juridica"]);

const responsePaginationSchema = z.object({
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
})

// export const clienteSchema = z.object({
//     id: z.number(),
//     name: z.string(),
//     alias: z.string(),
//     identificacion: z.string(),
//     identificacionType: z.string(),
//     contacto: z.string(),
//     email: z.string(),
//     telefono: z.string(),
//     ubicacion: z.string()
// })


export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    cc: z.string(),
    rol: z.object({
        name: roles
    })
});

export const paginationUsersSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true
}).extend({
    users: z.array(userSchema)
})


export const ItemSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    unidad: unidades,
    categoria: itemCategoryEnum
});

export const paginatioItemsSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true
}).extend({
    items: z.array(ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true
    }))
})

export const ManifestItemSchema = z.object({
    id: z.number(),
    // manifestId: z.number(),
    itemId: z.number(),
    cantidad: z.string(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
    isInvoiced: z.boolean(),
    item: ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true
    })
});

export const ClienteSchema = z.object({
    id: z.number(),
    name: z.string(),
    alias: z.string(),
    personaType: personaType,
    identificacionType: identificacionType,
    identificacion: z.string(),
    email: z.string(),
    direccion: z.string(),
    // contacto: z.string(),
    // telefono: z.string(),
    ubicacion: z.string(),
    // createdAt: z.string(),
    // updatedAt: z.string()
});

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    cc: z.string()
})

export const paginationClientesSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true
}).extend({
    clientes: z.array(ClienteSchema.pick({
        id: true,
        identificacion: true,
        name: true,
        alias: true,
        identificacionType: true,
        personaType: true
    }))
})

const ManifestTemplateSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const ManifestSchema = z.object({
    id: z.number(),
    plate: z.string(),
    location: z.string().nullable(),
    date: z.string(),
    dateFinal: z.string(),
    signature: z.string(),
    signatureClient: z.string(),
    photos: z.array(z.string()),
    observations: z.string().nullable(),
    createdBy: z.number(),
    isInvoiced: z.boolean(),
    isInternallyInvoiced: z.boolean(),
    isCertified: z.boolean(),
    quotationCode: z.string().nullable(),
    invoiceCode: z.string().nullable(),
    isEdit: z.boolean(),
    contactClient: z.string(),
    positionClient: z.string(),
    manifestItems: z.array(ManifestItemSchema.pick({
        id: true,
        cantidad: true,
        item: true,
    })),
    cliente: ClienteSchema.pick({
        alias: true,
        email: true,
        id: true,
        personaType: true,
        identificacion: true,
        identificacionType: true,
        name: true,
        ubicacion: true,
        direccion: true
    }),
    user: UserSchema,
    manifestTemplate: ManifestTemplateSchema
});

export const manifestSchema = ManifestSchema.pick({
    id:true,
    plate: true,
    location: true,
    date: true,
    dateFinal: true,
    signature: true,
    signatureClient: true,
    photos: true,
    observations: true,
    createdBy: true,
    isInvoiced: true,
    isInternallyInvoiced: true,
    isCertified: true,
    contactClient: true,
    positionClient: true,
    manifestItems: true,
    cliente: true,
    user: true,
    manifestTemplate: true,
})

export const manifestCommercialSchema = ManifestSchema.pick({
    id: true,
    date: true,
    isInvoiced: true,
    location: true,
    quotationCode: true
}).extend({
    cliente: ClienteSchema.pick({
        id: true,
        name: true,
        identificacion: true,
        identificacionType: true,
        alias: true
    }),
    manifestTemplate: ManifestTemplateSchema.pick({
        id: true,
        name: true
    }),
    manifestItems: z.array(ManifestItemSchema.pick({
        id: true,
        cantidad: true,
        isInvoiced: true
    }).extend({
        item: ItemSchema.pick({
            id: true,
            code: true,
            name: true,
            unidad: true
        })
    }))
})

export const manifestInvoiceSchema = ManifestSchema.pick({
    id: true,
    date: true,
    isInvoiced: true,
    location: true,
    invoiceCode: true,
    quotationCode: true,
    isEdit: true
}).extend({
    cliente: ClienteSchema.pick({
        id: true,
        name: true,
        identificacion: true,
        identificacionType: true,
        alias: true
    }),
    manifestTemplate: ManifestTemplateSchema.pick({
        id: true,
        name: true
    }),
    manifestItems: z.array(ManifestItemSchema.pick({
        id: true,
        cantidad: true,
        isInvoiced: true
    }).extend({
        item: ItemSchema.pick({
            id: true,
            code: true,
            name: true,
            unidad: true
        })
    }))
})

export const templateSchema = z.object({
    id: z.number(),
    name: z.string(),
    items: z.array(ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true
    }))
})

export const templatesSchema =  z.object({
    templates: z.array(templateSchema)
})

export const paginationTemplatesSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true
}).extend({
    templates: z.array(templateSchema)
})

export const manifesPreviewtSchema = ManifestSchema.pick({
    id: true,
    date: true, 
    isInvoiced: true,
    isInternallyInvoiced: true,
    isCertified: true,
}).extend({
    cliente: ClienteSchema.pick({
        id: true,
        name: true,
        identificacion: true,
        identificacionType: true,
        alias: true
    })
})

export const paginationManifestSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    manifests: z.array(manifesPreviewtSchema)
})

export const paginationManifestCommercialSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    manifests: z.array(manifestCommercialSchema)
})

export const paginationManifestInvoicelSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    manifests: z.array(manifestInvoiceSchema)
})