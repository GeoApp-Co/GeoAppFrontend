import { z } from 'zod';

export const roles = z.enum(["admin", "superAdmin", "conductor"])
export const unidades = z.enum(["litro", "kg", "unidad", 'hora'])

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
    unidad: unidades
});

export const paginatioItemsSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true
}).extend({
    items: z.array(ItemSchema)
})

const ManifestItemSchema = z.object({
    id: z.number(),
    // manifestId: z.number(),
    itemId: z.number(),
    cantidad: z.string(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
    item: ItemSchema
});

export const ClienteSchema = z.object({
    id: z.number(),
    name: z.string(),
    alias: z.string(),
    identificacionType: z.enum(["cc", "nit"]),
    identificacion: z.string(),
    email: z.string(),
    contacto: z.string(),
    telefono: z.string(),
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
        email: true,
        telefono: true,
        ubicacion: true,
        contacto: true,
    }))
})

const ManifestTemplateSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const ManifestSchema = z.object({
    id: z.number(),
    plate: z.string(),
    date: z.string(),
    signature: z.string(),
    signatureClient: z.string(),
    photos: z.array(z.string()),
    observations: z.string().nullable(),
    createdBy: z.number(),
    isInvoiced: z.boolean().nullable(),
    isInternallyInvoiced: z.boolean(),
    isCertified: z.boolean(),
    manifestItems: z.array(ManifestItemSchema),
    cliente: ClienteSchema,
    user: UserSchema,
    manifestTemplate: ManifestTemplateSchema
});

export const templateSchema = z.object({
    id: z.number(),
    name: z.string(),
    items: z.array(ItemSchema)
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