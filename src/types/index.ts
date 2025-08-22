import z from "zod"
import {  ClienteSchema, ItemSchema, manifesPreviewtSchema, manifestCommercialSchema, ManifestItemSchema, paginationManifestCommercialSchema, roles, templateSchema, unidades, userSchema } from "../schemas"

export type User = {
    name: string
    cc: string
}

export type Medidas = z.infer<typeof unidades>

export type LoginForm = Pick<User, 'cc'> & {
    password: string
}

export type SearchManifestForm = {
    search: string
    fecha?: Date | null;
    estado: string
}
export type SearchForm = {
    search: string
}

export type ManifestCommerceSearchFormData = {
    clientId: string;
    fechaMes?: Date | null;
    manifestTemplate?: string;
    location?: string;
    item?: string;
    manifestId: string
};

export type ItemCantidad = {
    itemId: number
    cantidad: number
}


export type NewManifestFormType = {
    clientId: number
    manifestTemplateId: number
    plate: string
    date: Date
    observations: string
    items: ItemCantidad[],
    photos: string[]
    signature: string
    signatureClient: string
    location: string
}

export type InvoiceCodeFormType = {
    invoiceCode: string
}



export type ClienteType = z.infer<typeof ClienteSchema>
export type ManifestType = z.infer<typeof manifesPreviewtSchema>
export type ManifestItemType = z.infer<typeof ManifestItemSchema>
export type ManifestCommerceType = z.infer<typeof manifestCommercialSchema>
export type ItemType = z.infer<typeof ItemSchema>
export type TemplateType = z.infer<typeof templateSchema>
export type UserType = z.infer<typeof userSchema>


// export type SelectedItemType = {
//     itemId: number;
//     code:
//     itemName: string;
//     item
// };

export type NewClientFormType = Pick<ClienteType, 'alias' | 'contacto' | 'email' | 'identificacion' | 'identificacionType' | 'name' | 'telefono' | 'ubicacion' >
export type NewItemFormType = Pick<ItemType, 'code' | 'name' | 'unidad' >
export type NewTemplateFormType = Pick<TemplateType, 'name' > & {
    itemIds: number[]
}
export type NewUserFormType = Pick<UserType, 'name' | 'cc' > & {
    password: string
    roleName: z.infer<typeof roles>
}

export type PaginationManifestCommercialType  = z.infer<typeof paginationManifestCommercialSchema>