import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
} from "@mui/material";

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

type CarsTableSkeletonProps = {
    rows?: number;
};

function CarsTableSkeleton({ rows = 5 }: CarsTableSkeletonProps) {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table size="small">
            <TableHead>
            <TableRow>
                <TableCell sx={headerStyle}>ID</TableCell>
                <TableCell sx={headerStyle}>Tipo de Carro</TableCell>
                <TableCell sx={headerStyle}>Placa</TableCell>
                <TableCell sx={headerStyle}>Acciones</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
                <TableRow key={index}>
                <TableCell>
                    <Skeleton variant="text" width={30} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" width={120} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                    <Skeleton
                    variant="rectangular"
                    width={70}
                    height={28}
                    sx={{ borderRadius: 1 }}
                    />
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default CarsTableSkeleton;
