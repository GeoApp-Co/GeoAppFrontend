import { CarType } from "@/src/types";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteCarButton from "./DeleteCarButton";

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

type CarsTableProps = {
    cars: CarType[];
};

function CarsTable({ cars }: CarsTableProps) {

    const router = useRouter()

    return (
        <TableContainer component={Paper} sx={{marginTop: 3}}>
        <Table size="small">
            <TableHead>
            <TableRow>
                <TableCell sx={{...headerStyle, width: "25%"}}>#</TableCell>
                <TableCell sx={{...headerStyle, width: "25%"}}>Placa</TableCell>
                <TableCell sx={{...headerStyle, width: "25%"}}>Tipo de Carro</TableCell>
                <TableCell sx={{...headerStyle, width: "25%"}}>Acciones</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {cars.map((car) => (
                <TableRow key={car.id}>
                    <TableCell>{car.id}</TableCell>
                    <TableCell><span className="uppercase">{car.plate}</span></TableCell>
                    <TableCell>{car.carType}</TableCell>
                    <TableCell>
                        <div className="flex flex-row gap-3">

                        <button
                            onClick={() => router.push(`/dashboard/vehiculos/${car.id}/edit`)}
                            className="px-3 py-1 text-sm bg-azul text-white rounded hover:bg-blue-600"
                        >
                            Editar
                        </button>
                        <DeleteCarButton carId={car.id}/>
                        </div>

                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default CarsTable;
