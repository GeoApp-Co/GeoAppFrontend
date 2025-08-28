"use client"

type ManifestInputUpdateProps = {
    quotationCode: string | null
    onQuotationCodeChange: (newQuotationCode: string) => void
    disabled: boolean
}

function ManifestInputUpdate( { quotationCode, onQuotationCodeChange, disabled  }  : ManifestInputUpdateProps) {

    return (
        <form className="flex items-center gap-2">
        <input
            type="text"
            value={quotationCode || ""}
            placeholder="Codigo de Cotización"
            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
            onChange={(e) => onQuotationCodeChange(e.target.value)}
            disabled={disabled}
        />
        </form>
    );
}

export default ManifestInputUpdate
