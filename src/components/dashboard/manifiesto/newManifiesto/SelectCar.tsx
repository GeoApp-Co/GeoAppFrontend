"use client"

import { getCars } from "@/src/api/carApi"
import { useQuery } from "@tanstack/react-query"
import { useFormContext } from "react-hook-form";

function SelectCar() {

    const {register } = useFormContext();

    const { data, isLoading } = useQuery({
        queryKey: ['cars'],
        queryFn: () => getCars({})
    })

    return (
        <div>
            <label className="text-azul font-bold block text-sm mb-1">Placa del vehiculo</label>
            {isLoading && !data ? (
                <p>Cargando plantillas...</p>
            ): (
                <select
                {...register("plateId")}
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-all"
            >
                <option value={0}>Seleccione una placa</option>
                    {data?.cars.map((car) => (
                        <option key={car.id} value={car.id} className="uppercase">
                            {car.plate} | {car.carType}
                        </option>
                    ))}
                </select>
            )}
            
        </div>
    )
}

export default SelectCar
