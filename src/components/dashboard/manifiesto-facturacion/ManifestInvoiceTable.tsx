"use client";

import { ManifestInvoiceType, ResponseManifestInvoiceType } from "@/src/types";
import { formatDateTimeLarge, formatNumber, translateMedidasSimbolos } from "@/src/utils";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import CheckIcon from '@mui/icons-material/Check';
import {
    Box,
    Checkbox,
    Collapse,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import * as React from "react";
import { selectedItem } from "../manifiesto-comercial/DashboardCommercialManifesto";
import { selectedManifestInvoice } from "./DashboardBillingManifesto";
import EditLockButton from "./EditLockButton";
import ManifestInputInvoiceUpdate from "./ManifestInputInvoiceUpdate";


type ManifestInvoiceTableProps = {
    manifests: ManifestInvoiceType[];
    selected: selectedManifestInvoice[]
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<ResponseManifestInvoiceType | undefined, Error>>
    onToggleManifest: (manifestId: number, items: selectedItem[]) => void
    onToggleItem: (manifestId: number, item: selectedItem) => void
    onInvoiceCodeChange: (newInvoiceCode: string) => void
    totalItems: number
    totalCantidad: number
};

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};


function Row({
    row,
    selected,
    onToggleManifest,
    onToggleItem,
    onInvoiceCodeChange,
    refetch,
    index
}: {
    row: ManifestInvoiceType;
    selected: selectedManifestInvoice[]
    onToggleManifest: (manifestId: number, items: selectedItem[]) => void
    onToggleItem: (manifestId: number, item: selectedItem) => void
    onInvoiceCodeChange: (newInvoiceCode: string) => void
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<ResponseManifestInvoiceType | undefined, Error>>
    index: number
}) {
    const [open, setOpen] = React.useState(false);

    const manifestSelected = selected.find((manifest) => manifest.id === row.id);

    // ✅ Padre (manifiesto) - Adaptado con isVoiced como en commercial
    const allItemsSelected = manifestSelected
    ? row.manifestItems.every((i) =>
        manifestSelected.items.some((sel) => (sel.id === i.item.id) && (sel.isVoiced))
        )
    : false;

    const someItemsSelected = manifestSelected
    ? row.manifestItems.some((i) =>
        manifestSelected.items.some((sel) => (sel.id === i.item.id) && (sel.isVoiced))
        ) && !allItemsSelected
    : false;


    return (
        <React.Fragment>
        {/* Fila principal (manifiesto) */}
        <TableRow
            sx={{
            "& > *": { borderBottom: "unset" },
            backgroundColor: index % 2 === 0 ? "#f9fafb" : "white", // intercalado
            }}
        >
            <TableCell padding="checkbox">
            <Checkbox
            checked={allItemsSelected}
            indeterminate={someItemsSelected}
            onChange={() =>
                onToggleManifest(
                row.id,
                row.manifestItems.map((i) => ({
                    id: i.item.id,   // 👈 usar item.id real
                    cantidad: +i.cantidad,
                    isVoiced: i.isInvoiced, // ✅ Usar isInvoiced como isVoiced
                    categoria: i.item.categoria
                }))
                )
            }
            />

            </TableCell>
            <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">{formatNumber(row.id)}</TableCell>
            <TableCell><span className="uppercase">{row.cliente.alias}</span></TableCell>
            <TableCell
                sx={{
                    maxWidth: 200,
                    whiteSpace: "normal",  
                    wordBreak: "break-word", 
                    textTransform: "uppercase",
                }}
            > {row.manifestTemplate?.name}</TableCell>
            <TableCell>{formatDateTimeLarge(row.date)}</TableCell>
            <TableCell>{row.location ?? "Sin ubicación"}</TableCell>
            <TableCell>
                {row.isInvoiced ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckIcon color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main">
                        Facturado
                        </Typography>
                    </Stack>
                ) : (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CloseIcon color="error" fontSize="small" />
                        <Typography variant="body2" color="error.main">
                        Pendiente
                        </Typography>
                    </Stack>
                )}
            </TableCell>
            <TableCell>{row.quotationCode || '-----'}</TableCell>
            <TableCell>
                <ManifestInputInvoiceUpdate
                    invoiceCode={
                        manifestSelected ? manifestSelected.invoiceCode : row.invoiceCode
                    }
                    onInvoiceCodeChange={onInvoiceCodeChange} 
                    disabled={!manifestSelected}
                />
            </TableCell>
            <TableCell>
                <EditLockButton
                    isEdit={row.isEdit}
                    manifestId={row.id}
                    refetch={refetch}
                />
            </TableCell>
        </TableRow>

        {/* Fila expandible con items - ADAPTADA AL ESTILO COMMERCIAL CON CATEGORÍAS */}
        <TableRow
            sx={{
            backgroundColor: index % 2 === 0 ? "#f3f4f6" : "#ffffff",
            }}
        >
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {Object.entries(
                    row.manifestItems.reduce((acc: Record<string, typeof row.manifestItems>, item) => {
                        const categoria = item.item.categoria || "Sin categoría";
                        if (!acc[categoria]) acc[categoria] = [];
                        acc[categoria].push(item);
                        return acc;
                    }, {})
                ).map(([categoria, items]) => {
                const totalCategoria = items.reduce((acc, it) => it.isInvoiced ? acc + +it.cantidad : acc , 0);

                return (
                    <Box key={categoria} sx={{ marginY: 1,}}>
                    {/* Nombre de la categoría */}
                    <h4 
                    className="text-md text-center font-semibold p-2 bg-azul text-white print:bg-gray-200 print:text-black print:p-1 print:text-xs"
                    >{categoria}</h4>

                    {/* Tabla de la categoría */}
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
                            <TableCell sx={{...headerStyle, width: 40 }}>✔</TableCell>
                            <TableCell sx={{...headerStyle, width: 60 }}>Código</TableCell>
                            <TableCell sx={{...headerStyle, }}>Nombre</TableCell>
                            <TableCell sx={{...headerStyle, width: 80 }}>Unidad</TableCell>
                            <TableCell sx={{...headerStyle, width: 100 }}>¿Se factura?</TableCell>
                            <TableCell sx={{...headerStyle, width: 80 }} align="right">
                            Cantidad
                            </TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {items.map((item, idx) => (
                            <TableRow
                            key={item.id}
                            sx={{
                                backgroundColor: idx % 2 === 0 ? "#fdfdfd" : "#f5f5f5",
                            }}
                            >
                            {/* ✔ fijo */}
                            <TableCell sx={{ width: 40 }} padding="checkbox">
                                <Checkbox
                                disabled={!item.isInvoiced}
                                checked={
                                    manifestSelected?.items.some((i) => (i.id === item.item.id) && (i.isVoiced)) ??
                                    false
                                }
                                onChange={() =>
                                    onToggleItem(row.id, {
                                        id: item.item.id,
                                        cantidad: +item.cantidad,
                                        isVoiced: item.isInvoiced, // ✅ Usar isInvoiced como isVoiced
                                        categoria: item.item.categoria
                                    })
                                }
                                />
                            </TableCell>

                            {/* Código */}
                            <TableCell sx={{ width: 60 }}>{item.item.code}</TableCell>

                            {/* Nombre */}
                            <TableCell
                                sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                }}
                            >
                                {item.item.name}
                            </TableCell>

                            {/* Unidad */}
                            <TableCell sx={{ width: 80 }}>
                                {translateMedidasSimbolos(item.item.unidad)}
                            </TableCell>

                            {/* Factura */}
                            <TableCell sx={{ width: 100 }}>
                                {item.isInvoiced ? (
                                    <Typography variant="body2" color="success.main">
                                    Facturar
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="error.main">
                                    ----
                                    </Typography>
                                )}
                            </TableCell>

                            {/* Cantidad */}
                            <TableCell align="right" sx={{ width: 80 }}>
                                {item.cantidad}
                            </TableCell>
                            </TableRow>
                        ))}

                        {/* Total de la categoría */}
                        <TableRow
                            sx={{
                            backgroundColor: "#f3f4f6",
                            fontWeight: "bold",
                            }}
                        >
                            <TableCell colSpan={5} align="right">
                            Total - {categoria}
                            </TableCell>
                            <TableCell align="right">{totalCategoria.toFixed(1)}</TableCell>
                        </TableRow>
                        </TableBody>
                    </Table>
                    </Box>
                );
                })}

            </Collapse>
            </TableCell>
        </TableRow>
        </React.Fragment>
    );
}

function ManifestInvoiceTable({ 
    manifests, 
    refetch, 
    onInvoiceCodeChange, 
    onToggleItem, 
    onToggleManifest, 
    selected 
}: ManifestInvoiceTableProps) {

    return (
        <>
        <TableContainer component={Paper}>
        <Table
            aria-label="collapsible table"
            size="small"
            stickyHeader
            sx={{
            "& th, & td": {
                padding: "4px 8px", // 👈 compacto como commercial
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
                <TableCell sx={{ ...headerStyle, maxWidth: 200, }}>Plantilla</TableCell>
                <TableCell sx={{ ...headerStyle, width: 120 }}>Fecha</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Ubicación</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Facturado</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>#-Cot</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>#-Fact</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Facturar</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {manifests.map((m, index) => (
                <Row
                key={m.id}
                row={m}
                selected={selected}
                onToggleManifest={onToggleManifest}
                onToggleItem={onToggleItem}
                onInvoiceCodeChange={onInvoiceCodeChange}
                refetch={refetch}
                index={index}
                />
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        </>
    );
}

export default ManifestInvoiceTable;