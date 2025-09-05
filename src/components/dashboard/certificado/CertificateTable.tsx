"use client";

import { CertificateClientType } from "@/src/types";
import { formatDateTimeLarge, formatNumber, translateIdentificacionTypeLong, translateIdentificacionTypeShort } from "@/src/utils";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";

type CertificateTableProps = {
    certificates: CertificateClientType[];
};

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

function CertificateTable({ certificates }: CertificateTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerStyle}>ID</TableCell>
                        <TableCell sx={headerStyle}>N° Certificado</TableCell>
                        <TableCell sx={headerStyle}>Cliente</TableCell>
                        <TableCell sx={headerStyle}>Identificación</TableCell>
                        <TableCell sx={headerStyle}>Alias</TableCell>
                        <TableCell sx={headerStyle}>Tipo</TableCell>
                        <TableCell sx={headerStyle}>Fecha Creación</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {certificates.map((c, index) => (
                        <TableRow
                            key={c.id}
                            sx={{
                                backgroundColor:
                                    index % 2 === 0 ? "#f9fafb" : "white",
                            }}
                        >
                            <TableCell>{formatNumber(c.id)}</TableCell>
                            <TableCell>{c.No}</TableCell>
                            <TableCell>{c.cliente.name}</TableCell>
                            <TableCell>
                                {translateIdentificacionTypeShort(c.cliente.identificacionType)}{" "}
                                {c.cliente.identificacion}
                            </TableCell>
                            <TableCell>{c.cliente.alias}</TableCell>
                            <TableCell>{c.certificateType}</TableCell>
                            <TableCell>
                                {formatDateTimeLarge(c.createdAt)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CertificateTable;
