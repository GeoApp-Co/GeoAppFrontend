import z from "zod"
import {  CarSchema, certificateSchema, certificateType, ClienteSchema, itemCategoryEnum, ItemSchema, manifesPreviewtSchema, manifestCertificateSchema, manifestCommercialSchema, manifestInvoiceSchema, ManifestItemSchema, manifestSchema, paginationManifestCommercialSchema, paginationManifestInvoicelSchema, responsePaginationSchema, roles, templateSchema, unidades, userSchema } from "../schemas"

export type User = {
    name: string
    cc: string
}

export type ResponsePaginationType = z.infer<typeof responsePaginationSchema>

export type ItemCategoryType = z.infer<typeof itemCategoryEnum>

export type CertificateType = z.infer<typeof certificateType>

export type GroupedItems = {
    [key in ItemCategoryType]?: Pick<ManifestItemType, 'id' | 'cantidad' | 'item' | 'volDesechos' | 'nHoras'|'nViajes'>[];
};

export type GroupedItemsForm = {
    [key in ItemCategoryType]?: Pick<ItemType, 'id' | 'unidad' | 'categoria' | 'code'  | 'name'> [];
};

export type Medidas = z.infer<typeof unidades>

export type LoginForm = Pick<User, 'cc'> & {
    password: string
}

export type SearchManifestForm = {
    clientId: string
    fecha?: Date | null;
    estado: string
    manifestTemplate: string;
}
export type SearchForm = {
    search: string
}

export type CertificateSearchFormType = {
    code: string
}

export type SearchItemForm = {
    search: string
    categoria?: ItemCategoryType
}

export type ManifestCommerceSearchFormData = {
    clientId: string;
    fechaMes?: Date | null;
    manifestTemplate?: string;
    location?: string;
    item?: string;
    manifestId: string
    quotationCode: string; 
    invoiceCode: string;
    isInvoiced: "" | "true" | "false";
};

export type ManifestInvoiceSearchFormData = ManifestCommerceSearchFormData & {
    invoiceCode: string; 

}

export type ItemCantidad = {
    itemId: number
    cantidad: number
    volDesechos?: number
    nViajes?: number
    nHoras?: number
}

export type NewManifestFormType = {
    clientId: number
    manifestTemplateId: number
    plateId: number
    date: Date
    dateFinal: Date
    observations: string
    items: ItemCantidad[],
    photos: string[]
    signature: string
    signatureClient: string
    location: string
    contactClient: string;
    positionClient: string;
    phone: string
}

export type NewCertificateType = {
    manifestIds: number[]
    No: string
    clientId: string
    certificateType: CertificateType
}

export type UpdateManifestFormType = {
    manifestTemplateId: number
    items: ItemCantidad[],
}

export type NewCarForm = Pick<CarType, 'carType' | 'plate'>


type QuotationCode = {
    manifestId: number
    quotationCode: string
}
type InvoiceCode = {
    manifestId: number
    invoiceCode: string
}

export type QuotationCodeFormType = {
    quotationCodes: QuotationCode[]
}

export type InvoiceCodeFormType = {
    invoiceCodes: InvoiceCode[]
}

export type ClienteType = z.infer<typeof ClienteSchema>
export type ClienteCellType = Pick<
    ClienteType,
    "id" | "name" | "alias" | "identificacion" | "personaType" | "identificacionType"
>;

export type ManifestType = z.infer<typeof manifesPreviewtSchema>
export type ManifestByIdType = z.infer<typeof manifestSchema>
export type ManifestItemType = z.infer<typeof ManifestItemSchema>
export type ManifestCommerceType = z.infer<typeof manifestCommercialSchema>
export type ManifestInvoiceType = z.infer<typeof manifestInvoiceSchema>
export type ManifestCertificateType = z.infer<typeof manifestCertificateSchema>
export type ItemType = z.infer<typeof ItemSchema>
export type TemplateType = z.infer<typeof templateSchema>
export type UserType = z.infer<typeof userSchema>
export type CarType = z.infer<typeof CarSchema>

// export type ResponseManifestInvoiceType = ManifestByIdType[] & ResponsePaginationType
export type ResponseManifestInvoiceType = z.infer<typeof paginationManifestInvoicelSchema>


export type CertificateClientType  = z.infer<typeof certificateSchema>

// export type SelectedItemType = {
//     itemId: number;
//     code:
//     itemName: string;
//     item
// };

export type NewClientFormType = Pick<ClienteType, 'alias' | 'email' | 'identificacion' | 'identificacionType' | 'name' | 'ubicacion' | 'direccion' | 'personaType' | 'phone1' | 'phone2' >
export type NewItemFormType = Pick<ItemType, 'code' | 'name' | 'unidad' | 'categoria' >
export type NewTemplateFormType = Pick<TemplateType, 'name' > & {
    itemIds: number[]
}
export type NewUserFormType = Pick<UserType, 'name' | 'cc' > & {
    password: string
    roleName: z.infer<typeof roles>
}

export type PaginationManifestCommercialType  = z.infer<typeof paginationManifestCommercialSchema>