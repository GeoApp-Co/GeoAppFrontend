"use client"

import { getSelectClient } from "@/src/api/clientApi";
import { ManifestCommerceSearchFormData, ManifestInvoiceSearchFormData, SearchManifestForm } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

type ClientSelectInputProps = {
    // Opcionales para comercio
    setValueCommerce?: UseFormSetValue<ManifestCommerceSearchFormData>;
    watchCommerce?: UseFormWatch<ManifestCommerceSearchFormData>;

    // Opcionales para invoice
    setValueInvoice?: UseFormSetValue<ManifestInvoiceSearchFormData>;
    watchInvoice?: UseFormWatch<ManifestInvoiceSearchFormData>;

    setValueManifest?: UseFormSetValue<SearchManifestForm>
    watchManifest?: UseFormWatch<SearchManifestForm>
};

function ClientSelectInput({
    setValueCommerce,
    watchCommerce,
    setValueInvoice,
    watchInvoice,
    setValueManifest,
    watchManifest
}: ClientSelectInputProps) {
    // 👉 Escoge el watch disponible
    const selectedClientId =
        watchCommerce?.("clientId") ?? watchInvoice?.("clientId") ?? watchManifest?.("clientId");

    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showInput, setShowInput] = useState(true);

    const debouncedSearch = debounce((val: string) => {
        setSearch(val);
    }, 300);

    const { data, isLoading } = useQuery({
        queryKey: ["clients", search],
        queryFn: () => getSelectClient({ search }),
        enabled: search.length > 0,
    });

    const selectedClient = data?.clientes.find((c) => c.id === +selectedClientId!);

    useEffect(() => {
        if (selectedClientId) {
        setShowDropdown(false);
        setShowInput(false);
        } else {
        setShowInput(true);
        }
    }, [selectedClientId]);

    return (
        <div className="relative w-full">
        <label className="text-azul font-bold block text-sm mb-1">Cliente</label>

        {showInput && (
            <input
            type="text"
            placeholder={selectedClient ? selectedClient.name : "Buscar cliente..."}
            onChange={(e) => {
                debouncedSearch(e.target.value);
                setShowDropdown(true);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            />
        )}

        {isLoading && (
            <span className="text-sm text-gray-500 block mt-1">Cargando...</span>
        )}

        {showDropdown && data && data?.clientes?.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded mt-1 w-full shadow max-h-60 overflow-y-auto">
            {data.clientes.map((client) => (
                <li
                key={client.id}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                    if (setValueCommerce) {
                        setValueCommerce("clientId", client.id.toString());
                    } else if (setValueInvoice) {
                        setValueInvoice("clientId", client.id.toString());
                    } else if (setValueManifest) {
                        setValueManifest("clientId", client.id.toString());
                    }
                    setShowDropdown(false);
                }}
                >
                <span className="font-medium">{client.alias}</span>{" "}
                <span className="text-xs text-gray-500">
                    ({client.identificacion})
                </span>
                </li>
            ))}
            </ul>
        )}

        {showDropdown && data?.clientes?.length === 0 && (
            <div className="absolute mt-1 bg-white border rounded px-4 py-2 text-gray-500">
            No se encontraron clientes.
            </div>
        )}

        {selectedClient && (
            <div className="mt-4 border-2 shadow-xl rounded p-2 bg-gray-50 flex items-center border-azul justify-between">
            <div>
                <h3 className="font-semibold text-lg text-gray-700">
                Cliente seleccionado
                </h3>
                <p>
                <span className="text-azul font-semibold">Nombre:</span>{" "}
                {selectedClient.name}
                </p>
                <p>
                <span className="text-azul font-semibold">Alias:</span>{" "}
                {selectedClient.alias}
                </p>
                <p>
                <span className="text-azul font-semibold">
                    Identificación ({selectedClient.identificacionType})
                </span>
                :{selectedClient.identificacion}
                </p>
            </div>
            <button
                type="button"
                onClick={() => {
                    if (setValueCommerce) {
                        setValueCommerce("clientId", "");
                    } else if (setValueInvoice) {
                        setValueInvoice("clientId", "");
                    } else if (setValueManifest) {
                        setValueManifest("clientId", "");
                    }
                    setSearch("");
                    setShowDropdown(false);
                }}

                className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
                Limpiar
            </button>
            </div>
        )}
        </div>
    );
}

export default ClientSelectInput;
