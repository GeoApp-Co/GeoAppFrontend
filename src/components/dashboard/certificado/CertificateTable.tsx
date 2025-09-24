"use client";
import React, { useState } from "react";
import { formatDateTimeLarge, formatNumber, translateIdentificacionTypeShort, translateMedidasSimbolos } from "@/src/utils";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Box,
    Typography,
    Button
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CertificateFullType } from "@/src/types";
import ManifestCertificatePagination from "./ManifestCertificatePagination";
import { useRouter } from "next/navigation";

type CertificateTableProps = {
    certificates: CertificateFullType[];
    page: number;
    totalPages: number;
};

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

function CertificateTable({ certificates, page, totalPages }: CertificateTableProps) {
    const [openRow, setOpenRow] = useState<number | null>(null);
    const router = useRouter()


    const handlerNavigateToCertificate = (certificateId: number) => {
        router.push(`/dashboard/certificado/${certificateId}/view`)
    }

    return (
        <>
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerStyle}>Items</TableCell>
                        <TableCell sx={headerStyle}>ID</TableCell>
                        <TableCell sx={headerStyle}>Cliente</TableCell>
                        <TableCell sx={headerStyle}>N° Certificado</TableCell>
                        <TableCell sx={headerStyle}>Identificación</TableCell>
                        <TableCell sx={headerStyle}>Fecha Creación</TableCell>
                        <TableCell sx={headerStyle}>Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {certificates.map((c, index) => (
                        <React.Fragment key={c.id}>
                        <TableRow
                            key={c.id}
                            sx={{
                                backgroundColor:
                                    index % 2 === 0 ? "#f9fafb" : "white",
                            }}
                        >
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => setOpenRow(openRow === c.id ? null : c.id)}
                                >
                                    {openRow === c.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell>{formatNumber(c.id)}</TableCell>
                            <TableCell>{c.cliente.alias}</TableCell>
                            <TableCell>{c.code}</TableCell>
                            <TableCell>{translateIdentificacionTypeShort(c.cliente.identificacionType)} {c.cliente.identificacion}</TableCell>
                            <TableCell>{formatDateTimeLarge(c.createdAt)}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined" size="small" color="primary"
                                    onClick={() => handlerNavigateToCertificate(c.id)}
                                >
                                    Ver
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                <Collapse in={openRow === c.id} timeout="auto" unmountOnExit>
                                    <Box margin={1}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#0a2e5c' }}>
                                            Items Relacionados
                                        </Typography>
                                        {/* Agrupar items por categoría */}
                                        {Object.entries(
                                            c.manifestItems.reduce<
                                                Record<string, typeof c.manifestItems>
                                            >((acc, item) => {
                                                const categoria = item.item.categoria || "Sin categoría";
                                                if (!acc[categoria]) acc[categoria] = [];
                                                acc[categoria].push(item);
                                                return acc;
                                            }, {})
                                        ).map(([categoria, items]) => {
                                            const isEspecial = categoria === "ESPECIAL";
                                            return (
                                                <Box key={categoria} sx={{ marginY: 1 }}>
                                                    <h4 className="text-md text-center font-semibold p-2 bg-azul text-white print:bg-gray-200 print:text-black print:p-1 print:text-xs">
                                                        {categoria}
                                                    </h4>
                                                    <Table
                                                        size="small"
                                                        aria-label={`items-${categoria}`}
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
                                                                <TableCell sx={{ ...headerStyle, width: 60 }}>Código</TableCell>
                                                                <TableCell sx={{ ...headerStyle, width: 220 }}>Nombre</TableCell>
                                                                <TableCell sx={{ ...headerStyle, width: 60 }}>Unidad</TableCell>
                                                                <TableCell sx={{ ...headerStyle, width: 80 }}>Cantidad</TableCell>
                                                                {isEspecial && (
                                                                    <TableCell sx={{ ...headerStyle, width: 100 }}>Vol. Desechos</TableCell>
                                                                )}
                                                                {isEspecial && (
                                                                    <TableCell sx={{ ...headerStyle, width: 80 }}># Viajes</TableCell>
                                                                )}
                                                                {isEspecial && (
                                                                    <TableCell sx={{ ...headerStyle, width: 80 }}># Horas</TableCell>
                                                                )}
                                                                <TableCell sx={{ ...headerStyle }}>Disposición Final</TableCell>
                                                                <TableCell sx={{ ...headerStyle, width: 120 }}>Tiquete</TableCell>
                                                                <TableCell sx={{ ...headerStyle, width: 140 }}>Fecha Disp. Final</TableCell>
                                                                <TableCell sx={{ ...headerStyle, width: 120 }}>Certificado Final</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {items.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>{item.item.code}</TableCell>
                                                                    <TableCell><span className="uppercase">{item.item.name}</span></TableCell>
                                                                    <TableCell>{translateMedidasSimbolos(item.item.unidad)}</TableCell>
                                                                    <TableCell>{item.cantidad}</TableCell>
                                                                    {isEspecial && (
                                                                        <TableCell>{item.volDesechos ?? "-"}</TableCell>
                                                                    )}
                                                                    {isEspecial && (
                                                                        <TableCell>{item.nViajes ?? "-"}</TableCell>
                                                                    )}
                                                                    {isEspecial && (
                                                                        <TableCell>{item.nHoras ?? "-"}</TableCell>
                                                                    )}
                                                                    <TableCell>
                                                                        <div className="flex flex-col text-xs text-azul leading-tight">
                                                                            <span className="font-semibold text-gray-500 text-xs">
                                                                                {item.disposicionFinal?.sitio?.nombre || "-"}
                                                                            </span>
                                                                            <span>
                                                                                {item.disposicionFinal?.licencia?.licencia || "-"}
                                                                            </span>
                                                                            <span>
                                                                                {item.disposicionFinal?.tratamiento || "-"}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{item.tiquete ?? "-"}</TableCell>
                                                                    <TableCell>
                                                                        {item.fechaDisposicionFinal ? formatDateTimeLarge(item.fechaDisposicionFinal) : "-"}
                                                                    </TableCell>
                                                                    <TableCell>{item.certificadoFinal ?? "-"}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <ManifestCertificatePagination
            page={page}
            totalPages={totalPages}
        />
        </>
    );
}

export default CertificateTable;
