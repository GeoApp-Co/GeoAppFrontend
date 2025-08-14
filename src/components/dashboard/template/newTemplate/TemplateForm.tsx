"use client"
import { getItems } from "@/src/api/itemApi";
import { ItemType, NewTemplateFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import ItemsPagination from "../../item/ItemsPagination";
import TemplateItemsTable from "../TemplateItemsTable";


type TemplateFormProps = {
    register: UseFormRegister<NewTemplateFormType>;
    errors: FieldErrors<NewTemplateFormType>;
    setValue: UseFormSetValue<NewTemplateFormType>
    initialItems: ItemType[]
};

function TemplateForm({ errors, register, setValue, initialItems}: TemplateFormProps) {
    const [selectedItems, setSelectedItems] = useState<ItemType[]>(initialItems || []);
    const [search, setSearch] = useState("")
    const [currentPage] = useState(1);

    const debouncedSearch = debounce((val: string) => {
            setSearch(val)
        }, 300)

    const { data, isLoading} = useQuery({
        queryKey: ['items', search, currentPage],
        queryFn: () => getItems({  search, page: currentPage, limit: 10 }),

    });

    const handleSelectItem = (item: ItemType) => {
        if (selectedItems.find((i) => i.id === item.id)) {
            setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
        } else {
            setSelectedItems([...selectedItems, { id: item.id, name: item.name , code: item.code, unidad: item.unidad}]);
        }
    };

    const handleRemoveItem = (itemId: number) => {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    };

    useEffect(() => {
        setValue("itemIds", selectedItems.map((item) => item.id));
    }, [selectedItems, setValue]);

    return (
        <div> {/* Envía los datos al onSubmit */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Nombre</label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "El Nombre es obligatorio",
                        })}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Nombre de la plantilla"
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Items Selecionados</label>

                    <TemplateItemsTable 
                        items={selectedItems}
                        handleRemoveItem={handleRemoveItem}
                    />
                </div>

                <div>
                    <label className="text-azul font-bold block text-sm mb-1">Buscar Items</label>
                    <input
                        type="text"
                        // value={search}
                        onChange={(e) => {
                            debouncedSearch(e.target.value)
                        }}
                        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Buscar por nombre de item..."
                    />
                </div>
                <div>

                    {isLoading &&
                        <p>Cargando...</p>
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {data?.items.map((item) => (
                            <div key={item.id} className="">
                                <div>
                                <input
                                    type="checkbox"
                                    id={`item-${item.id}`}
                                    checked={selectedItems.find((i) => i.id === item.id) !== undefined}
                                    onChange={() => handleSelectItem(item)}
                                />
                                <label htmlFor={`item-${item.id}`} className="ml-2">
                                    {item.name}
                                </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    

                    {data && <ItemsPagination
                        page={currentPage}
                        totalPages={data.totalPages}
                    />}
                </div>

                

            </div>
        </div>
    );
}

export default TemplateForm;
