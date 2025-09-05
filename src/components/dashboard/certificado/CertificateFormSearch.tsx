"use client";

import { Dispatch, SetStateAction } from "react";
import ClientSelectInput from "../manifiesto-comercial/ClientSelectInput";

type CertificateFormSearchProps = {
    onSearchChange: (value: string) => void;
    clientId: string;
    setClientId: Dispatch<SetStateAction<string>>
};

function CertificateFormSearch({ onSearchChange, clientId, setClientId }: CertificateFormSearchProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Select de cliente */}
        <div>
            <ClientSelectInput
                clientId={clientId}
                onChangeClientId={setClientId}
            />
        </div>
        
        {/* Input de código */}
        <div>
            <label className="text-azul font-bold block text-sm mb-1">
            Código de Facturación
            </label>
            <input
            type="text"
            placeholder="Buscar por código de facturación..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            />
        </div>

        </div>
);
}

export default CertificateFormSearch;
