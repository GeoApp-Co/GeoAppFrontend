"use client";
import { GroupedItems, ManifestCommerceType, PaginationManifestCommercialType, Unidades } from "@/src/types";
import { formatDateTimeLarge, formatNumber, translateMedidasSimbolos, traslateMedidas } from "@/src/utils";
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
import { selectedItem, selectedManifest } from "./DashboardCommercialManifesto";
import InvoiceStatusCell from "./InvoiceStatusCell";
import ManifestInputUpdate from "./ManifestInputUpdate";


type ManifestCommercialTableProps = {
    manifests: ManifestCommerceType[];
    selected: selectedManifest[]
    onToggleManifest: (manifestId: number, items: selectedItem[]) => void
    onToggleItem: (manifestId: number, item: selectedItem) => void
    onQuotationCodeChange: (newQuotationCode: string) => void
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>
};

export const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};


function Row({
    row,
    selected,
    onToggleManifest,
    onToggleItem,
    onQuotationCodeChange,
    refetch,
    index
}: {
    row: ManifestCommerceType;
    selected: selectedManifest[]
    onToggleManifest: (manifestId: number, items: selectedItem[]) => void
    onToggleItem: (manifestId: number, item: selectedItem) => void
    onQuotationCodeChange: (newQuotationCode: string) => void
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>
    index: number
}) {
    const [open, setOpen] = React.useState(false);

    const manifestSelected = selected.find((manifest) => manifest.id === row.id);

    // ✅ Padre (manifiesto)
    const allItemsSelected = manifestSelected
    ? row.manifestItems.every((i) =>
        manifestSelected.items.some((sel) => (sel.id === i.item.id) && (sel.isVoiced))
        )
    : false;

    const someItemsSelected = manifestSelected
    ? row.manifestItems.some((i) =>
        manifestSelected.items.some((sel) => (sel.id === i.item.id) && (sel.isVoiced) )
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
                    isVoiced: i.isInvoiced,
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
                    maxWidth: 160,
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
            <TableCell>
                <ManifestInputUpdate
                    quotationCode={
                        manifestSelected ? manifestSelected.quotationCode : row.quotationCode // usa lo que está en selected
                    }
                    onQuotationCodeChange={onQuotationCodeChange} 
                    disabled={!manifestSelected}
                />
            </TableCell>
            <TableCell>
                {row.invoiceCode ? row.invoiceCode : '-----'}
            </TableCell>
        </TableRow>

        {/* Fila expandible con items */}
        <TableRow
            sx={{
            backgroundColor: index % 2 === 0 ? "#f3f4f6" : "#ffffff",
            }}
        >
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {Object.entries(
                    row.manifestItems.reduce((acc: Record<string, typeof row.manifestItems>, item) => {
                        const categoria = item.item.categoria || "Sin categoría";
                        if (!acc[categoria]) acc[categoria] = [];
                        acc[categoria].push(item);
                        return acc;
                    }, {})
                ).map(([categoria, items]) => {
                    const isSpecialCategory = categoria.toLowerCase() === "especial";
                    const isServicio = categoria.toLowerCase() === "servicio";
                    // Agrupar y sumar por unidad
                    const unidadDefault: Record<Unidades, number> = {
                        unidad: 0,
                        litro: 0,
                        kg: 0,
                        hora: 0,
                        galones: 0,
                        m3: 0,
                    };
                    items.forEach((item) => {
                        if (!item.isInvoiced) return;
                        const unidad = item.item.unidad;
                        const cantidad = parseFloat(item.cantidad) || 0;
                        if (!unidadDefault[unidad]) unidadDefault[unidad] = 0;
                        unidadDefault[unidad] += cantidad;
                    });

                    return (
                        <Box key={categoria} sx={{bgcolor: 'gray'}}>
                            {/* Nombre de la categoría */}
                            <h4
                                className="text-md text-center font-semibold p-2 bg-azul text-white print:bg-gray-200 print:text-black print:p-1 print:text-xs"
                            >
                                {categoria}
                            </h4>

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
                                        <TableCell sx={{ ...headerStyle, width: 40 }}>✔</TableCell>
                                        <TableCell sx={{ ...headerStyle, width: 60 }}>Código</TableCell>
                                        <TableCell sx={{ ...headerStyle }}>Nombre</TableCell>
                                        <TableCell sx={{ ...headerStyle, width: 80 }}>Unidad</TableCell>
                                        <TableCell sx={{ ...headerStyle, width: 100 }}>¿Se factura?</TableCell>
                                        <TableCell sx={{ ...headerStyle, width: 80 }} align="right">
                                            {isServicio ? "" : "Cantidad"}
                                        </TableCell>
                                        {isSpecialCategory && (
                                            <>
                                                <TableCell sx={{ ...headerStyle, width: 100 }}>Vol. Desechos</TableCell>
                                                <TableCell sx={{ ...headerStyle, width: 80 }}># Viajes</TableCell>
                                                <TableCell sx={{ ...headerStyle, width: 80 }}># Minutos</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {items.map((item, idx) => {
                                        // Para checkbox de cantidad en servicio o aromatizante
                                        const isAromatizante =
                                            isServicio || item.item.name.toLowerCase().includes("aromatizante");
                                        return (
                                            <TableRow
                                                key={item.id}
                                                sx={{
                                                    backgroundColor: idx % 2 === 0 ? "#b0b3b8" : "#d1d5db", // gris más oscuro y gris medio
                                                    "& th, & td": {
                                                        padding: "4px 8px", // igual que invoice, filas delgadas
                                                        fontSize: "0.8rem",
                                                    },
                                                    height: 32, // fuerza altura mínima
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
                                                                isVoiced: item.isInvoiced,
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
                                                    <InvoiceStatusCell
                                                        isInvoiced={item.isInvoiced}
                                                        manifestItemId={item.id}
                                                        refetch={refetch}
                                                    />
                                                </TableCell>

                                                {/* Cantidad o checkbox para servicio/aromatizante */}
                                                <TableCell align="center" sx={{ width: 80 }}>
                                                    {isServicio ? (
                                                        <Checkbox
                                                            checked={parseFloat(item.cantidad) > 0}
                                                            disabled
                                                            size="small"
                                                            sx={{
                                                                color: "#0054a6",
                                                                "&.Mui-checked": {
                                                                    color: "#0054a6",
                                                                },
                                                            }}
                                                        />
                                                    ) : isAromatizante ? (
                                                        <Checkbox
                                                            checked={parseFloat(item.cantidad) > 0}
                                                            disabled
                                                            size="small"
                                                            sx={{
                                                                color: "#0054a6",
                                                                "&.Mui-checked": {
                                                                    color: "#0054a6",
                                                                },
                                                            }}
                                                        />
                                                    ) : (
                                                        <span>
                                                            {parseFloat(item.cantidad) === 0 ? "----" : item.cantidad}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                {/* Volumen, viajes, horas para especial */}
                                                {isSpecialCategory && (
                                                    <>
                                                        <TableCell sx={{ width: 100 }} align="right">
                                                            {parseFloat(item.volDesechos || "0") === 0
                                                                ? "----"
                                                                : parseFloat(item.volDesechos || "0").toFixed(1)}
                                                        </TableCell>
                                                        <TableCell sx={{ width: 80 }} align="right">{item.nViajes || '----'}</TableCell>
                                                        <TableCell sx={{ width: 80 }} align="right">
                                                            {parseFloat(item.nHoras || "0") === 0
                                                                ? "----"
                                                                : parseFloat(item.nHoras || "0").toFixed(1)}
                                                        </TableCell>
                                                    </>
                                                )}

                                            </TableRow>
                                        );
                                    })}

                                    {/* Totales por unidad: una fila por cada unidad con cantidad > 0 */}
                                    {(Object.keys(unidadDefault) as (keyof typeof unidadDefault)[])
                                        .filter((unidad) => unidadDefault[unidad] > 0)
                                        .map((unidad, idx, arr) => (
                                            <TableRow
                                                key={unidad}
                                                sx={{
                                                    backgroundColor: "#f3f4f6",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                <TableCell colSpan={isSpecialCategory ? 5 : 5} align="right">
                                                    Total - {translateMedidasSimbolos(unidad)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span className="text-azul">{unidadDefault[unidad].toFixed(1)} </span>
                                                </TableCell>
                                                {isSpecialCategory && idx === 0 && (
                                                    <TableCell align="right" rowSpan={arr.length}>
                                                        <span className="text-azul">
                                                            {items.reduce((acc, it) => acc + (parseFloat(it.volDesechos || "0") || 0), 0).toFixed(1)}
                                                        </span>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
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

function ManifestCommercialTable({ selected, onToggleItem, onToggleManifest, onQuotationCodeChange, manifests, refetch,}: ManifestCommercialTableProps) {

    return (
        <>
        <TableContainer component={Paper}>
        <Table
            aria-label="collapsible table"
            size="small"
            stickyHeader
            sx={{
            "& th, & td": {
                padding: "4px 8px", // 👈 compacto
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
                <TableCell sx={{ ...headerStyle, maxWidth: 160, }}>Plantilla</TableCell>
                <TableCell sx={{ ...headerStyle, width: 120 }}>Fecha</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Ubicación</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Facturado</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>#-Cot</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>#-Fact</TableCell>
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
                onQuotationCodeChange={onQuotationCodeChange}
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

export default ManifestCommercialTable;
