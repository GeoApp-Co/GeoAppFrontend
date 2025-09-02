"use client"
import { getItems } from "@/src/api/itemApi";
import { ItemType, NewTemplateFormType } from "@/src/types";
import ErrorMessage from "@/src/UI/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import TemplateItemsTable from "../TemplateItemsTable";
import { translateMedidasSimbolos } from "@/src/utils";
import Checkbox from "@mui/material/Checkbox";
import ItemsFormPagination from "./ItemsFormPagination";


type TemplateFormProps = {
    register: UseFormRegister<NewTemplateFormType>;
    errors: FieldErrors<NewTemplateFormType>;
    setValue: UseFormSetValue<NewTemplateFormType>
    initialItems: ItemType[]
};

function TemplateForm({ errors, register, setValue, initialItems}: TemplateFormProps) {
    const [selectedItems, setSelectedItems] = useState<ItemType[]>(initialItems || []);
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearch = debounce((val: string) => {
            setSearch(val)
        }, 300)

    const { data, isLoading} = useQuery({
        queryKey: ['templateItems', search, currentPage],
        queryFn: () => getItems({  search, page: currentPage, limit: 10 }),

    });

    const handleSelectItem = (item: ItemType) => {
        if (selectedItems.find((i) => i.id === item.id)) {
            setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
        } else {
            setSelectedItems([...selectedItems, { id: item.id, name: item.name , code: item.code, unidad: item.unidad, categoria: item.categoria}]);
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

            <div className="min-h-[600px]">
            {isLoading ? (
                <p>Cargando...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.items.map((item) => {
                    const isSelected = selectedItems.some((i) => i.id === item.id);
                    return (
                    <div
                        key={item.id}
                        className={`flex items-center justify-between p-1 border rounded-md shadow-sm ${
                        isSelected ? "border-azul bg-blue-50" : "border-gray-300"
                        }`}
                    >
                        <div className="flex items-center gap-2 flex-1">
                        <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectItem(item)}
                            color="primary"
                        />
                        <label htmlFor={`item-${item.id}`} className="text-sm font-medium text-gray-800">
                            {item.name}
                        </label>
                        </div>
                        <p className="text-sm font-bold text-azul">{translateMedidasSimbolos(item.unidad)}</p>
                    </div>
                    );
                })}
                </div>
            )}

            {data && (
                <ItemsFormPagination
                page={currentPage}
                totalPages={data.totalPages}
                setPage={setCurrentPage}
                />
            )}
            </div>

            </div>
        </div>
    );
}

export default TemplateForm;
