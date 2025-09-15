import {
    Box,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import * as React from "react";

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

type ManifestTableSkeletonProps = {
    rows?: number;
};

function ManifestTableSkeleton({ rows = 5 }: ManifestTableSkeletonProps) {
    return (
        <TableContainer component={Paper}>
            <Table
                aria-label="loading table"
                size="small"
                stickyHeader
                sx={{
                    "& th, & td": {
                        padding: "4px 8px",
                        fontSize: "0.8rem",
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...headerStyle, width: 40 }}>✔</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 60 }}>Items</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 70 }}>ID</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>Cliente</TableCell>
                        <TableCell sx={{ ...headerStyle, maxWidth: 160 }}>Plantilla</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 120 }}>Fecha</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>Ubicación</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>Facturado</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>#-Cot</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>#-Fact</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(new Array(rows)).map((_, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                "& > *": { borderBottom: "unset" },
                                backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                            }}
                        >
                            {/* Checkbox skeleton */}
                            <TableCell padding="checkbox">
                                <Skeleton variant="rectangular" width={18} height={18} />
                            </TableCell>
                            
                            {/* Expand button skeleton */}
                            <TableCell>
                                <Skeleton variant="circular" width={24} height={24} />
                            </TableCell>
                            
                            {/* ID skeleton */}
                            <TableCell>
                                <Skeleton variant="text" width={50} />
                            </TableCell>
                            
                            {/* Cliente skeleton */}
                            <TableCell>
                                <Skeleton variant="text" width={80} />
                            </TableCell>
                            
                            {/* Plantilla skeleton */}
                            <TableCell>
                                <Skeleton variant="text" width={120} />
                            </TableCell>
                            
                            {/* Fecha skeleton */}
                            <TableCell>
                                <Skeleton variant="text" width={100} />
                            </TableCell>
                            
                            {/* Ubicación skeleton */}
                            <TableCell>
                                <Skeleton variant="text" width={80} />
                            </TableCell>
                            
                            {/* Estado facturado skeleton */}
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="circular" width={16} height={16} />
                                    <Skeleton variant="text" width={60} />
                                </Box>
                            </TableCell>
                            
                            {/* Código cotización skeleton */}
                            <TableCell>
                                <Skeleton variant="rectangular" width={70} height={24} />
                            </TableCell>
                            
                            {/* Código factura skeleton */}
                            <TableCell>
                                <Skeleton variant="text" width={60} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// Skeleton para items expandidos (opcional)
function ManifestItemsSkeleton({ categories = 2 }: { categories?: number }) {
    return (
        <Box sx={{ padding: 1 }}>
            {Array.from(new Array(categories)).map((_, categoryIndex) => (
                <Box key={categoryIndex} sx={{ marginY: 1 }}>
                    {/* Skeleton del header de categoría */}
                    <Skeleton 
                        variant="rectangular" 
                        height={32} 
                        sx={{ 
                            marginBottom: 1,
                            backgroundColor: 'rgba(0, 84, 166, 0.1)'
                        }} 
                    />
                    
                    {/* Skeleton de la tabla de items */}
                    <Table
                        size="small"
                        sx={{
                            tableLayout: "fixed",
                            width: "100%",
                            border: "1px solid #e5e7eb",
                            "& th, & td": {
                                padding: "4px 8px",
                                fontSize: "0.8rem",
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{...headerStyle, width: 40 }}>✔</TableCell>
                                <TableCell sx={{...headerStyle, width: 60 }}>Código</TableCell>
                                <TableCell sx={{...headerStyle }}>Nombre</TableCell>
                                <TableCell sx={{...headerStyle, width: 80 }}>Unidad</TableCell>
                                <TableCell sx={{...headerStyle, width: 100 }}>¿Se factura?</TableCell>
                                <TableCell sx={{...headerStyle, width: 80 }} align="right">
                                    Cantidad
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(3)).map((_, itemIndex) => (
                                <TableRow
                                    key={itemIndex}
                                    sx={{
                                        backgroundColor: itemIndex % 2 === 0 ? "#fdfdfd" : "#f5f5f5",
                                    }}
                                >
                                    <TableCell sx={{ width: 40 }} padding="checkbox">
                                        <Skeleton variant="rectangular" width={18} height={18} />
                                    </TableCell>
                                    <TableCell sx={{ width: 60 }}>
                                        <Skeleton variant="text" width={40} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="80%" />
                                    </TableCell>
                                    <TableCell sx={{ width: 80 }}>
                                        <Skeleton variant="text" width={30} />
                                    </TableCell>
                                    <TableCell sx={{ width: 100 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Skeleton variant="circular" width={12} height={12} />
                                            <Skeleton variant="text" width={40} />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ width: 80 }}>
                                        <Skeleton variant="text" width={30} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            {/* Skeleton del total */}
                            <TableRow
                                sx={{
                                    backgroundColor: "#f3f4f6",
                                    fontWeight: "bold",
                                }}
                            >
                                <TableCell colSpan={5} align="right">
                                    <Skeleton variant="text" width={120} />
                                </TableCell>
                                <TableCell align="right">
                                    <Skeleton variant="text" width={40} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            ))}
        </Box>
    );
}

export { ManifestTableSkeleton, ManifestItemsSkeleton };