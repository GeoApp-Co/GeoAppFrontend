"use client";

import { getSelectTemplates } from "@/src/api/templateApi";
import { ItemCantidad, ItemType, TemplateType } from "@/src/types";
import { transformAndValidateQuantity, traslateMedidas } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
function TemplateComboBox() {
    const { setValue, watch, register } = useFormContext();
    const selectedTemplateId = watch("manifestTemplateId");
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | undefined>();
    const [showTemplateTable, setShowTemplateTable] = useState(false);
    const [showTemplateList, setShowTemplateList] = useState(true);
    const { data, isLoading } = useQuery({
        queryKey: ["templates"],
        queryFn: () => getSelectTemplates({ search: "" }),
    });

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
                    <button onClick={handleClearSelection} className="mb-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded">Limpiar selección</button>
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
                            {selectedTemplate?.items.map((m :  ItemType) => (
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

                                                    // Actualizar el array de items
                                                    const currentItems: ItemCantidad[] = watch("items") || [];
                                                    const updatedItems = currentItems.map((item) =>
                                                        item.itemId === m.id
                                                            ? { ...item, cantidad: validatedQuantity }
                                                            : item
                                                    );

                                                    setValue("items", updatedItems);
                                                } else {
                                                    console.error("Cantidad inválida");
                                                }
                                            },
                                        })}
                                        placeholder="0.00"
                                        step="0.01"
                                        defaultValue={0}
                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-azul bg-white text-sm"
                                    />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TemplateComboBox;

