"use client"
import { getCars } from "@/src/api/carApi"
import Heading from "@/src/UI/Heading"
import { Button } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import CarsTable from "./CarsTable"
import CarsTableSkeleton from "./CarsTableSkeleton"
import { useRouter } from "next/navigation"

function DashboardCar() {

    const router = useRouter()

    const { data, isLoading} = useQuery({
        queryKey: ['cars'],
        queryFn: () => getCars({})
    })

    const handleNavigateNewcar = () => {
        router.push('/dashboard/vehiculos/new')
    }

    return (
        <section className="bg-white p-3">

            <Heading>Lista de Vehículos</Heading>

            <div>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                    onClick={handleNavigateNewcar}
                    sx={{
                        borderRadius: "16px",
                        marginTop: 1,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "1rem",
                    }}
                >
                Agregar Vehículo
                </Button>
            </div>

            {isLoading && 
                <CarsTableSkeleton 
                    rows={6}
                />
            }

            {data && 
                <CarsTable 
                    cars={data.cars}
                />
            }
        
        </section>
    )
}

export default DashboardCar
