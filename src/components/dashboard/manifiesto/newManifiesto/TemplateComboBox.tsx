"use client";

import { getSelectTemplates } from "@/src/api/templateApi";
import { GroupedItemsForm, ItemCantidad, TemplateType } from "@/src/types";
import { transformAndValidateQuantity, traslateMedidas } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

type TemplateComboBoxProps = {
    manifestTemplate?: TemplateType
}

function TemplateComboBox( {  manifestTemplate} : TemplateComboBoxProps) {

    const { setValue, watch, register } = useFormContext();


    const selectedTemplateId = manifestTemplate ? manifestTemplate.id :watch("manifestTemplateId");
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | undefined>(manifestTemplate || undefined);
    const [showTemplateList, setShowTemplateList] = useState(manifestTemplate ? false : true);
    const [showTemplateTable, setShowTemplateTable] = useState(manifestTemplate ? true : false);


    const { data, isLoading } = useQuery({
        queryKey: ["templates"],
        queryFn: () => getSelectTemplates({ search: "" }),
    });

    const groupedItems = useMemo(() => {

        if (!selectedTemplate) return {};

        return selectedTemplate.items.reduce<GroupedItemsForm>((acc, item) => {
            const categoria = item.categoria || 'OTRO';
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
            <label className="text-azul font-bold block text-sm mb-1">Plantilla de Manifiesto</label>

            {showTemplateList && (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ${isLoading ? 'opacity-50' : ''}`}>
                            {isLoading ? (
                                <p>Cargando plantillas...</p>
                            ) : data?.templates.length === 0 ? (
                                <p>No hay plantillas disponibles</p>
                            ) : (
                                data?.templates.map((template) => (
                                    <div
                                        key={template.id}
                                className="flex flex-col p-4 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                                onClick={() => handleTemplateSelect(template)}
                                    >
                                        <h3 className="text-lg font-medium">{template.name}</h3>
                                        <span className="text-gray-600 text-sm">({template.items.length} ítems)</span>
                                    </div>
                                ))
                            )}
                        </div>
            )}

            {showTemplateTable && (
            <div className="mt-5 bg-white p-5 rounded-xl">
                <h3 className="text-lg font-bold mb-2 text-azul">{selectedTemplate?.name}</h3>

                {!manifestTemplate &&
                    <button
                        onClick={handleClearSelection}
                        className="mb-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                    >
                        Limpiar selección
                    </button>
                }

                {Object.entries(groupedItems).map(([categoria, items]) => {

                const currentItems: ItemCantidad[] = watch("items") || [];

                const totalCategoria = items.reduce((acc, item) => {
                    const match = currentItems.find((i) => i.itemId === item.id);
                    return acc + (match?.cantidad || 0);
                }, 0);

                return (
                    <div key={categoria} className="mb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">{categoria}</h4>
                    <table className="w-full text-sm text-left border border-gray-200 rounded-md">
                        <thead>
                        <tr className="bg-azul text-white text-sm">
                            <th className="p-2">Código</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Unidad</th>
                            <th className="p-2">Cantidad</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((m) => (
                            <tr key={m.id} className="border-b hover:bg-blue-100">
                            <td className="p-2">{m.code}</td>
                            <td className="p-2">{m.name}</td>
                            <td className="p-2">{traslateMedidas(m.unidad)}</td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    {...register(`cantidad-${m.id}`, {
                                        required: true,
                                        min: 0.0,
                                        valueAsNumber: true,
                                        onChange: (e) => {
                                        const validatedQuantity = transformAndValidateQuantity(e.target.value);
                                        if (validatedQuantity !== null) {
                                            setValue(`cantidad-${m.id}`, validatedQuantity);

                                            const updatedItems = currentItems.map((item) =>
                                            item.itemId === m.id
                                                ? { ...item, cantidad: validatedQuantity }
                                                : item
                                            );

                                            setValue("items", updatedItems);
                                        }
                                        },
                                    })}
                                    placeholder="0.00"
                                    step="0.01"
                                    value={currentItems.find((i) => i.itemId === m.id)?.cantidad ?? 0}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-azul bg-white text-sm"
                                />
                            </td>
                            </tr>
                        ))}

                        {/* Fila de sumatoria */}
                        <tr className="bg-gray-100 font-semibold text-azul">
                            <td></td>
                            <td colSpan={2} className="p-2">Total - {categoria}</td>
                            <td className="p-2">{totalCategoria.toFixed(2)}</td>
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

