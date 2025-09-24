import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Box, Typography } from "@mui/material";
import React from "react";

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

export function ManifestFinalDisposalTableSkeleton() {
    return (
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...headerStyle, width: 60 }}>Items</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 70 }}>ID</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>Cliente</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 250 }}>Plantilla</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 120 }}>Fecha</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>Ubicación</TableCell>
                        <TableCell sx={{ ...headerStyle, width: 100 }}>#-Cot</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(10)].map((_, idx) => (
                        <TableRow key={idx}>
                            {[...Array(7)].map((_, colIdx) => (
                                <TableCell key={colIdx}>
                                    <Skeleton variant="rectangular" height={24} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export function ManifestFinalDisposalTableNoResults() {
    return (
        <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
                No se encontraron resultados.
            </Typography>
        </Box>
    );
}
