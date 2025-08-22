"use client";
import { ManifestItemType } from "@/src/types";

type ManifestInputPriceUpdateProps = {
    price: ManifestItemType["price"] | string | null;
    onPriceChange: (newPrice: string) => void;
};

function ManifestInputPriceUpdate({ price, onPriceChange }: ManifestInputPriceUpdateProps) {
    return (
        <form className="flex items-center gap-2">
        <input
            type="text"
            value={price || "0"}
            placeholder="Precio"
            className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
            onChange={(e) => onPriceChange(e.target.value)}
        />
        </form>
    );
}

export default ManifestInputPriceUpdate;
