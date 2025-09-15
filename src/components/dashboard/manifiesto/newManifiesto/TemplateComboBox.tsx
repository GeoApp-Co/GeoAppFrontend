"use client";

import { getSelectTemplates } from "@/src/api/templateApi";
import { GroupedItemsForm, ItemCantidad, TemplateType } from "@/src/types";
import {
    transformAndValidateQuantity,
    translateMedidasSimbolos,
} from "@/src/utils";
import { Checkbox } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

type TemplateComboBoxProps = {
    manifestTemplate?: TemplateType;
};

function TemplateComboBox({ manifestTemplate }: TemplateComboBoxProps) {
    const { setValue, watch, register } = useFormContext();

    const selectedTemplateId = manifestTemplate
        ? manifestTemplate.id
        : watch("manifestTemplateId");

    const [selectedTemplate, setSelectedTemplate] = useState<
        TemplateType | undefined
    >(manifestTemplate || undefined);

    const [showTemplateList, setShowTemplateList] = useState(
        manifestTemplate ? false : true
    );

    const [showTemplateTable, setShowTemplateTable] = useState(
        manifestTemplate ? true : false
    );

    const { data, isLoading } = useQuery({
        queryKey: ["templates"],
        queryFn: () => getSelectTemplates({ search: "" }),
    });

    const groupedItems = useMemo(() => {
        if (!selectedTemplate) return {};

        return selectedTemplate.items.reduce<GroupedItemsForm>((acc, item) => {
        const categoria = item.categoria || "OTRO";
        if (!acc[categoria]) acc[categoria] = [];
        acc[categoria].push(item);
        return acc;
        }, {});
    }, [selectedTemplate]);

    useEffect(() => {
        if (selectedTemplateId) {
        const template = data?.templates.find((t) => t.id === selectedTemplateId);
        setSelectedTemplate(template);
        setShowTemplateTable(true);
        setShowTemplateList(false);
        } else {
        setSelectedTemplate(undefined);
        setShowTemplateTable(false);
        setShowTemplateList(true);
        }
    }, [selectedTemplateId, data]);

    const handleTemplateSelect = (template: TemplateType) => {
        setSelectedTemplate(template);
        setValue("manifestTemplateId", template.id);

        // Inicializar items con cantidad 0
        const initialItems = template.items.map((item) => ({
            itemId: item.id,
            cantidad: 0,
        }));

        setValue("items", initialItems);

        setShowTemplateTable(true);
        setShowTemplateList(false);
    };

    const handleClearSelection = () => {
        setSelectedTemplate(undefined);
        setValue("manifestTemplateId", null);
        setValue("items", []);
        setShowTemplateTable(false);
        setShowTemplateList(true);
    };

    return (
        <div className="w-full col-span-2">
        <label className="text-azul font-bold block text-sm mb-1">
            Plantilla de Manifiesto
        </label>

        {showTemplateList && (
            <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ${
                isLoading ? "opacity-50" : ""
            }`}
            >
            {isLoading ? (
                <p>Cargando plantillas...</p>
            ) : data?.templates.length === 0 ? (
                <p>No hay plantillas disponibles</p>
            ) : (
                data?.templates.map((template) => (
                <div
                    key={template.id}
                    className="flex flex-col p-2 bg-gray-100 rounded-md cursor-pointer border-azul border-2 hover:bg-gray-200"
                    onClick={() => handleTemplateSelect(template)}
                >
                    <h3 className="text-sm font-medium uppercase">
                    {template.name}
                    </h3>
                    <span className="text-gray-600 text-sm">
                    ({template.items.length} ítems)
                    </span>
                </div>
                ))
            )}
            </div>
        )}

        {showTemplateTable && (
            <div className="mt-5 bg-white p-5 rounded-xl">
            <h3 className="text-lg text-center font-bold mb-2 text-azul">
                {selectedTemplate?.name}
            </h3>

            {!manifestTemplate && (
                <button
                onClick={handleClearSelection}
                className="mb-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                >
                    Limpiar selección
                </button>
            )}

            {Object.entries(groupedItems).map(([categoria, items]) => {

                const currentItems: ItemCantidad[] = watch("items") || [];

                const totalCategoria = items.reduce((acc, item) => {
                    const match = currentItems.find((i) => i.itemId === item.id);
                    return acc + (match?.cantidad || 0);
                }, 0);

                // Verificar la CATEGORIA
                const isServiceCategory = categoria.toLowerCase().includes('servicio');
                const isSpecialCategory = categoria.toLowerCase() === "especial"; 
                const isCheckboxItem = (itemName: string) => {
                    return (
                        isServiceCategory ||
                        itemName.toLowerCase().includes("aromatizante") 
                    );
                };

                return (
                    <div key={categoria} className="mb-6">
                        <h4 className="text-md text-center font-semibold p-2 bg-azul text-white">{categoria}</h4>
                        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
                            <thead>
                                <tr className="bg-azul text-white text-sm">
                                    <th className="p-2 w-20">Código</th>
                                    <th className="p-2">Nombre</th>
                                    <th className="p-2 w-20 text-right">Unidad</th>
                                    <th className="p-2 w-20 text-right">
                                        {isServiceCategory ? 'Seleccionar' : 'Cantidad'}
                                    </th>
                                    {isSpecialCategory && (
                                        <>
                                        <th className="p-2 w-32 text-right">Vol. Desechos</th>
                                        <th className="p-2 w-24 text-right"># Viajes</th>
                                        <th className="p-2 w-24 text-right"># Horas</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((m) => (
                                    <tr key={m.id} className="border-b hover:bg-blue-100">
                                        <td className="p-2 w-20">{m.code}</td>
                                        <td className="p-2 uppercase">{m.name}</td>
                                        <td className="p-2 w-20 text-right">{translateMedidasSimbolos(m.unidad)}</td>
                                        <td className="p-2 w-20 text-right">
                                            {isCheckboxItem(m.name) ? (
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        {...register(`cantidad-${m.id}`, {
                                                            onChange: (e) => {
                                                                const isChecked = e.target.checked;
                                                                const cantidad = isChecked ? 1 : 0;

                                                                const updatedItems = currentItems.map((item) =>
                                                                    item.itemId === m.id ? { ...item, cantidad } : item
                                                                );

                                                                setValue("items", updatedItems);
                                                            },
                                                        })}
                                                        checked={currentItems.find((i) => i.itemId === m.id)?.cantidad === 1}
                                                        size="small"
                                                        sx={{
                                                            color: '#0054a6',
                                                            '&.Mui-checked': {
                                                                color: '#0054a6',
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <input
                                                    type="number"
                                                    {...register(`cantidad-${m.id}`, {
                                                        min: 0,
                                                        valueAsNumber: true,
                                                        onChange: (e) => {
                                                            const rawValue = e.target.value;

                                                            if (rawValue === "") {
                                                                const updatedItems = currentItems.map((item) =>
                                                                    item.itemId === m.id ? { ...item, cantidad: 0 } : item
                                                                );
                                                                setValue("items", updatedItems);
                                                                return;
                                                            }

                                                            const validatedQuantity = transformAndValidateQuantity(rawValue);
                                                            if (validatedQuantity !== null) {
                                                                // Forzar a un decimal
                                                                const fixedValue = Number(validatedQuantity.toFixed(1));
                                                                setValue(`cantidad-${m.id}`, fixedValue);

                                                                const updatedItems = currentItems.map((item) =>
                                                                    item.itemId === m.id ? { ...item, cantidad: fixedValue } : item
                                                                );

                                                                setValue("items", updatedItems);
                                                            }
                                                        },
                                                    })}
                                                    placeholder="0.0"
                                                    step="0.1"
                                                    value={currentItems.find((i) => i.itemId === m.id)?.cantidad ?? ""} 
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-azul bg-white text-sm"
                                                />
                                            )}
                                        </td>
                                        {isSpecialCategory && (
                                        <>
                                            {/* Volumen de desechos - decimal */}
                                            <td className="p-2 w-24 text-right">
                                            <input
                                                    type="number"
                                                    placeholder="0.0"
                                                    step="0.1"
                                                    min={0}
                                                    {...register(`volDesechos-${m.id}`, {
                                                    valueAsNumber: true,
                                                    onChange: (e) => {
                                                        const rawValue = e.target.value;
                                                        if (rawValue === "") {
                                                        const updatedItems = currentItems.map(item =>
                                                            item.itemId === m.id ? { ...item, volDesechos: 0 } : item
                                                        );
                                                        setValue("items", updatedItems);
                                                        return;
                                                        }

                                                        const validatedValue = transformAndValidateQuantity(rawValue);
                                                        if (validatedValue !== null) {
                                                        const fixedValue = Number(validatedValue.toFixed(1));
                                                        setValue(`volDesechos-${m.id}`, fixedValue);

                                                        const updatedItems = currentItems.map(item =>
                                                            item.itemId === m.id ? { ...item, volDesechos: fixedValue } : item
                                                        );
                                                        setValue("items", updatedItems);
                                                        }
                                                    },
                                                    })}
                                                    value={currentItems.find(i => i.itemId === m.id)?.volDesechos ?? ""}
                                                    className="w-full px-1 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </td>

                                            {/* Número de viajes - entero */}
                                            <td className="p-2 w-20 text-right">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                step="1"
                                                min={0}
                                                {...register(`nViajes-${m.id}`, {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    const rawValue = e.target.value;

                                                    if (rawValue === "") {
                                                    const updatedItems = currentItems.map(item =>
                                                        item.itemId === m.id ? { ...item, nViajes: 0 } : item
                                                    );
                                                    setValue("items", updatedItems);
                                                    return;
                                                    }

                                                    const validatedValue = transformAndValidateQuantity(rawValue);
                                                    if (validatedValue !== null) {
                                                    // Forzar a entero
                                                    const fixedValue = Math.round(validatedValue);
                                                    setValue(`nViajes-${m.id}`, fixedValue);

                                                    const updatedItems = currentItems.map(item =>
                                                        item.itemId === m.id ? { ...item, nViajes: fixedValue } : item
                                                    );
                                                    setValue("items", updatedItems);
                                                    }
                                                },
                                                })}
                                                value={currentItems.find(i => i.itemId === m.id)?.nViajes ?? ""}
                                                className="w-full px-1 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            </td>

                                            {/* Número de horas - decimal */}
                                            <td className="p-2 w-20 text-right">
                                            <input
                                                type="number"
                                                placeholder="0.0"
                                                step="0.1"
                                                min={0}
                                                {...register(`nHoras-${m.id}`, {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    const rawValue = e.target.value;
                                                    if (rawValue === "") {
                                                    const updatedItems = currentItems.map(item =>
                                                        item.itemId === m.id ? { ...item, nHoras: 0 } : item
                                                    );
                                                    setValue("items", updatedItems);
                                                    return;
                                                    }

                                                    const validatedValue = transformAndValidateQuantity(rawValue);
                                                    if (validatedValue !== null) {
                                                    const fixedValue = Number(validatedValue.toFixed(1));
                                                    setValue(`nHoras-${m.id}`, fixedValue);

                                                    const updatedItems = currentItems.map(item =>
                                                        item.itemId === m.id ? { ...item, nHoras: fixedValue } : item
                                                    );
                                                    setValue("items", updatedItems);
                                                    }
                                                },
                                                })}
                                                value={currentItems.find(i => i.itemId === m.id)?.nHoras ?? ""}
                                                className="w-full px-1 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            </td>
                                        </>
                                        )}

                                    </tr>
                                ))}

                                {/* Fila de sumatoria */}
                                <tr className="bg-gray-100 font-semibold text-azul">
                                    <td></td>
                                    <td colSpan={ 2} className="p-2">Total - {categoria}</td>
                                    <td className={`p-2 ${isSpecialCategory ? "text-left" : "text-right"}`}>
                                    {isServiceCategory
                                        ? `${totalCategoria} servicios`
                                        : totalCategoria.toFixed(1)}
                                    </td>
                                    <td colSpan={isSpecialCategory ? 3 : 0}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            })}
            </div>
        )}
        </div>
    );
}

export default TemplateComboBox;
