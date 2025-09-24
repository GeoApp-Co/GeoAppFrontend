import { z } from 'zod';

export const roles = z.enum(["admin", "superAdmin", "conductor", "comercio", "factura", 'operacion', 'disposicionFinal']);
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
    "RESIDUOS APROVECHABLES",
    "RESIDUOS NO APROVECHABLES",
    "RESIDUOS HOSPITALARIOS",
    "RESIDUOS PELIGROSOS SOLIDOS",
    "RESIDUOS PELIGROSOS LIQUIDOS",
    "RESIDUOS GENERADOS EN ATENCIÓN Y SALUD",
    "SUMINISTRO",
    "SERVICIO",
    "ESPECIAL",
    "INSUMOS",
    "OTRO",
]);
export const periodos = z.enum(["mensual", "trimestral", "semestral",]);
export const personaType = z.enum(["natural", "juridica"]);
export const certificateType = z.enum([
    "CERTIFICADO DE GESTIÓN INTEGRAL DE RESIDUOS"
]);
export const carTypeEnum = z.enum(["CAMIONETA", "COMPACTADOR", "FURGON", "VOLQUETA"]);
// --- Tratamientos Disposición Final ---
export const tratamientosDisposicionFinalEnum = z.enum([
    "TRATAMIENTO/DISPOSICIÓN FINAL",
    "CONFINAMIENTO EN RELLENO SANITARIO",
    "CONFINAMIENTO EN CELDA DE SEGURIDAD",
    "BIORREMEDIACIÓN CON LANDFARMING",
    "APROVECHAMIENTO DE ACEITES USADOS",
    "VENTA DE AGUA EN BLOQUE",
    "APROVECHAMIENTO DE ACEITES DE COCINA USADOS",
    "DEWATERING - BIORREMEDIACIÓN",
    "APROVECHAMIENTO",
    "DESACTIVACIÓN",
    "DISPOSICIÓN FINAL",
    "INCINERACIÓN"
]);

export const responsePaginationSchema = z.object({
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

export const CarSchema = z.object({
    id: z.number(),
    carType: carTypeEnum,
    plate: z.string()
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


export const DisposicionFinalSitioSchema = z.object({
    id: z.number(),
    nombre: z.string(),
});

export const DisposicionFinalLicenciaSchema = z.object({
    id: z.number(),
    licencia: z.string(),
});

export const DisposicionFinalSchema = z.object({
    id: z.number(),
    sitio: DisposicionFinalSitioSchema,
    licencia: DisposicionFinalLicenciaSchema,
    sitioId: z.number(),
    licenciaId: z.number(),
    tratamiento: tratamientosDisposicionFinalEnum
});

export const ManifestItemSchema = z.object({
    id: z.number(),
    // manifestId: z.number(),
    itemId: z.number(),
    cantidad: z.string(),
    volDesechos: z.string().nullable(),
    nViajes: z.number().nullable(),
    nHoras: z.string().nullable(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
    isInvoiced: z.boolean(),
    // disposicionFinalId: z.number().nullable(),
    tiquete: z.string().nullable(),
    fechaDisposicionFinal: z.string().nullable(),
    certificadoFinal: z.string().nullable(),
    entregado: z.boolean().nullable(),
    item: ItemSchema.pick({
        code: true,
        id: true,
        name: true,
        unidad: true,
        categoria: true
    }),
    // Relación con la combinación de sitio y licencia (disposición final)
    disposicionFinal: DisposicionFinalSchema.pick({
        id: true,
        tratamiento: true,
        sitio: true,
        licencia: true,
    }).nullable().optional(),
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
    phone1: z.string(),
    phone2: z.string(),
    ubicacion: z.string(),
    contacto: z.string().nullable().optional(),
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
    // plate: z.string(),
    location: z.string().nullable(),
    date: z.string(),
    dateFinal: z.string(),
    signature: z.string(),
    signatureClient: z.string(),
    photos: z.array(z.string()),
    observations: z.string().nullable(),
    createdBy: z.number(),
    isInvoiced: z.boolean(),
    // isInternallyInvoiced: z.boolean(),
    // isCertified: z.boolean(),
    quotationCode: z.string().nullable(),
    invoiceCode: z.string().nullable(),
    isEdit: z.boolean(),
    contactClient: z.string(),
    positionClient: z.string(),
    phone: z.string(),
    manifestItems: z.array(ManifestItemSchema.pick({
        id: true,
        cantidad: true,
        item: true,
        nHoras: true,
        nViajes: true,
        volDesechos: true,
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
        direccion: true,
        phone1: true,
        phone2: true
    }),
    user: UserSchema,
    manifestTemplate: ManifestTemplateSchema,
    car: CarSchema.pick({
        carType: true,
        plate: true
    })
});

export const manifestSchema = ManifestSchema.pick({
    id:true,
    location: true,
    date: true,
    dateFinal: true,
    signature: true,
    signatureClient: true,
    photos: true,
    observations: true,
    createdBy: true,
    isInvoiced: true,
    // isInternallyInvoiced: true,
    // isCertified: true,
    contactClient: true,
    positionClient: true,
    manifestItems: true,
    cliente: true,
    // user: true,
    manifestTemplate: true,
    car: true,
    phone: true
}).extend({
    user: userSchema.pick({
        id: true,
        name: true,
        cc: true,
        rol: true
    })
})

export const manifestCommercialSchema = ManifestSchema.pick({
    id: true,
    date: true,
    isInvoiced: true,
    location: true,
    quotationCode: true,
    invoiceCode: true
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
        isInvoiced: true,
        nHoras: true,
        nViajes: true,
        volDesechos: true,
    }).extend({
        item: ItemSchema.pick({
            id: true,
            code: true,
            name: true,
            unidad: true,
            categoria: true
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
        isInvoiced: true,
        nHoras: true,
        nViajes: true,
        volDesechos: true,
    }).extend({
        item: ItemSchema.pick({
            id: true,
            code: true,
            name: true,
            unidad: true,
            categoria: true
        })
    }))
})

export const manifestCertificateSchema = ManifestSchema.pick({
    id: true,
    date: true,
    isInvoiced: true,
    location: true,
    invoiceCode: true,
    quotationCode: true,
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
        volDesechos: true,
        nViajes: true,
        nHoras: true,
        disposicionFinal: true,
        tiquete: true,
        fechaDisposicionFinal: true,
        certificadoFinal: true,
    }).extend({
        item: ItemSchema.pick({
            id: true,
            code: true,
            name: true,
            unidad: true,
            categoria: true
            
        })
    }))
})

export const manifestFinalDisposalSchema = ManifestSchema.pick({
    id: true,
    date: true,
    // isInvoiced: true,
    location: true,
    quotationCode: true,
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
    manifestItems: z.array(
        ManifestItemSchema.pick({
            id: true,
            cantidad: true,
            volDesechos: true,
            nViajes: true,
            nHoras: true,
            tiquete: true,
            fechaDisposicionFinal: true,
            certificadoFinal: true,
            entregado: true,
            // disposicionFinalId: true,
            // tratamiento: true,
            disposicionFinal: true,
            item: true,
        })
    )
});

export const paginationManifestFinalDisposalSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    manifests: z.array(manifestFinalDisposalSchema)
});



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
    // isInternallyInvoiced: true,
    // isCertified: true,
    manifestTemplate: true
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

export const paginationManifestCertificateSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    manifests: z.array(manifestCertificateSchema)
})

export const CertificateSchema = z.object({
    id: z.number(),
    No: z.string(),
    certificateType: certificateType,
    createdAt: z.string()
})


export const certificateSchema = CertificateSchema.pick({
    certificateType: true,
    createdAt: true,
    id: true,
    No: true,

}).extend({
    cliente: ClienteSchema.pick({
        id: true,
        name: true,
        alias: true,
        identificacion: true,
        identificacionType: true,
    })
})

export const paginationCertificatesSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    certificates: z.array(
certificateSchema)
})

export const responseCarsSchema = z.object({
    cars: z.array(CarSchema)
})


export const responseDisposicionFinalSitioSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    sitios: z.array(DisposicionFinalSitioSchema)
})

export const responseDisposicionFinalLicenciaSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    licencias: z.array(DisposicionFinalLicenciaSchema)
})

export const responseDisposicionFinalSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    disposiciones: z.array(DisposicionFinalSchema)
})

export const CertificateFullSchema = z.object({
    id: z.number(),
    code: z.string(),
    createdAt: z.string(),
    cliente: ClienteSchema.pick({
        id: true,
        name: true,
        alias: true,
        identificacion: true,
        identificacionType: true,
        phone1: true,
        ubicacion: true,
        direccion: true,
        contacto: true
    }),
    manifestItems: z.array(
        ManifestItemSchema.pick({
            id: true,
            cantidad: true,
            volDesechos: true,
            nViajes: true,
            nHoras: true,
            tiquete: true,
            fechaDisposicionFinal: true,
            certificadoFinal: true,
        }).extend({
            item: ItemSchema.pick({
                id: true,
                code: true,
                name: true,
                unidad: true,
                categoria: true
            }),
            disposicionFinal: DisposicionFinalSchema.pick({
                id: true,
                tratamiento: true,
                sitio: true,
                licencia: true,
            })
        })
    )
});

export const paginationCertificatesFullSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    certificates: z.array(CertificateFullSchema)
});

// // Esquema específico para la respuesta de getCertificates (sin reutilizar otros esquemas)
// export const CertificateItemSchema = z.object({
//     id: z.number(),
//     name: z.string(),
//     code: z.string(),
//     unidad: z.string(),
//     categoria: z.string(),
// });

// export const CertificateDisposicionFinalSitioSchema = z.object({
//     id: z.number(),
//     nombre: z.string(),
// });

// export const CertificateDisposicionFinalLicenciaSchema = z.object({
//     id: z.number(),
//     licencia: z.string(),
// });

// export const CertificateDisposicionFinalSchema = z.object({
//     id: z.number(),
//     tratamiento: z.string(),
//     sitio: CertificateDisposicionFinalSitioSchema.nullable().optional(),
//     licencia: CertificateDisposicionFinalLicenciaSchema.nullable().optional(),
// });

// export const CertificateManifestItemSchema = z.object({
//     id: z.number(),
//     cantidad: z.any(),
//     volDesechos: z.any().nullable(),
//     nViajes: z.any().nullable(),
//     nHoras: z.any().nullable(),
//     tiquete: z.string().nullable(),
//     fechaDisposicionFinal: z.string().nullable(),
//     certificadoFinal: z.string().nullable(),
//     entregado: z.boolean().nullable(),
//     itemId: z.number(),
//     disposicionFinalId: z.number().nullable(),
//     item: CertificateItemSchema,
//     disposicionFinal: CertificateDisposicionFinalSchema.nullable().optional(),
// });

// export const CertificateClienteSchema = z.object({
//     id: z.number(),
//     name: z.string(),
//     identificacion: z.string(),
//     identificacionType: z.string(),
//     alias: z.string(),
// });

// export const CertificateGetSchema = z.object({
//     id: z.number(),
//     code: z.string(),
//     createdAt: z.string(),
//     cliente: CertificateClienteSchema,
//     manifestItems: z.array(CertificateManifestItemSchema),
// });

// export const PaginationCertificatesGetSchema = z.object({
//     total: z.number(),
//     totalPages: z.number(),
//     currentPage: z.number(),
//     certificates: z.array(CertificateGetSchema)
// });


export const NpsSchema = z.object({
    id: z.number(),
    clienteId: z.number(),
    personaEncuestada: z.string(),
    cargo: z.string(),
    encuestado: z.boolean(),
    fechaEncuesta: z.string(),
    puntaje: z.string(),
    observaciones: z.string().nullable().optional(),
    periodo: periodos,
    proximaFecha: z.string(),
});

export const paginationNpsSchema = responsePaginationSchema.pick({
    currentPage: true,
    total: true,
    totalPages: true,
}).extend({
    nps: z.array(NpsSchema)
});

export const plantillaClienteSchema = z.object({
    id: z.number(),
    name: z.string()
})

export const plantillasClienteSchema = z.array(plantillaClienteSchema)
