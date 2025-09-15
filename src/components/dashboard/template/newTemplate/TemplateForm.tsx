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
import { Skeleton } from "@mui/material";
import { da } from "zod/v4/locales";

type TemplateFormProps = {
    register: UseFormRegister<NewTemplateFormType>;
    errors: FieldErrors<NewTemplateFormType>;
    setValue: UseFormSetValue<NewTemplateFormType>;
    initialItems: ItemType[];
};

function TemplateForm({ errors, register, setValue, initialItems }: TemplateFormProps) {
    const [selectedItems, setSelectedItems] = useState<ItemType[]>(initialItems || []);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearch = debounce((val: string) => {
        setSearch(val);
    }, 300);

    const { data, isLoading } = useQuery({
        queryKey: ["templateItems", search, currentPage],
        queryFn: () => getItems({ search, page: currentPage, limit: 10 }),
    });

    const handleSelectItem = (item: ItemType) => {
        if (selectedItems.find((i) => i.id === item.id)) {
        setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
        } else {
        setSelectedItems([
            ...selectedItems,
            {
            id: item.id,
            name: item.name,
            code: item.code,
            unidad: item.unidad,
            categoria: item.categoria,
            },
        ]);
        }
    };

    const handleRemoveItem = (itemId: number) => {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    };

    useEffect(() => {
        setValue(
        "itemIds",
        selectedItems.map((item) => item.id)
        );
    }, [selectedItems, setValue]);

    return (
        <div>
        {/* Nombre plantilla */}
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

            {/* Items seleccionados */}
            <div>
            <label className="text-azul font-bold block text-sm mb-1">Items Selecionados</label>
            <TemplateItemsTable items={selectedItems} handleRemoveItem={handleRemoveItem} />
            </div>

            {/* Buscar Items */}
            <div>
            <label className="text-azul font-bold block text-sm mb-1">Buscar Items</label>
            <input
                type="text"
                onChange={(e) => {
                debouncedSearch(e.target.value);
                }}
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Buscar por nombre de item..."
            />
            </div>

            {/* Lista de Items */}
            <div>
            {isLoading ? (
                // Skeletons cuando está cargando
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded-md shadow-sm border-gray-200"
                    >
                    <div className="flex items-center gap-2 flex-1">
                        <Skeleton variant="circular" width={24} height={24} />
                        <div className="flex flex-col gap-1">
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width={80} height={16} />
                        </div>
                    </div>
                    <Skeleton variant="text" width={40} height={20} />
                    </div>
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.items.map((item) => {
                    const isSelected = selectedItems.some((i) => i.id === item.id);
                    return (
                    <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 border rounded-md shadow-sm ${
                        isSelected ? "border-azul bg-blue-50" : "border-gray-300"
                        }`}
                    >
                        <div className="flex items-center gap-2 flex-1">
                        <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectItem(item)}
                            color="primary"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{item.name}</span>
                            <span className="text-xs text-gray-500">{item.categoria}</span>
                        </div>
                        </div>
                        <p className="text-sm font-bold text-azul">
                        {translateMedidasSimbolos(item.unidad)}
                        </p>
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
