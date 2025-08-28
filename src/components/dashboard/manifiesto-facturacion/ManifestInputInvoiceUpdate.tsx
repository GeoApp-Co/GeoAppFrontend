"use client"

type ManifestInputInvoiceUpdateProps = {
    invoiceCode: string | null
    onInvoiceCodeChange: (newinvoiceCode: string) => void
    disabled: boolean
}

function ManifestInputInvoiceUpdate( { invoiceCode, onInvoiceCodeChange, disabled  }  : ManifestInputInvoiceUpdateProps) {

    return (
        <form className="flex items-center gap-2">
        <input
            type="text"
            value={invoiceCode || ""}
            placeholder="Codigo de Facturación"
            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
            onChange={(e) => onInvoiceCodeChange(e.target.value)}
            disabled={disabled}
        />
        </form>
    );
}

export default ManifestInputInvoiceUpdate
