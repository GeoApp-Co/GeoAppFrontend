"use client";

import { ManifestCommerceType, PaginationManifestCommercialType } from "@/src/types";
import { formatDateTimeLarge, formatNumber, traslateMedidas } from "@/src/utils";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
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
        manifestSelected.items.some((sel) => sel.id === i.item.id)
        )
    : false;

    const someItemsSelected = manifestSelected
    ? row.manifestItems.some((i) =>
        manifestSelected.items.some((sel) => sel.id === i.item.id)
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
            <TableCell component="th" scope="row">
            {formatNumber(row.id)}
            </TableCell>
            <TableCell>{row.cliente.alias}</TableCell>
            <TableCell>{row.manifestTemplate.name}</TableCell>
            <TableCell>{formatDateTimeLarge(row.date)}</TableCell>
            <TableCell>{row.location ?? "Sin ubicación"}</TableCell>
            <TableCell>
                {row.isInvoiced ? (

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircleIcon color="success" fontSize="small" />
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
        </TableRow>

        {/* Fila expandible con items */}
        <TableRow
            sx={{
            backgroundColor: index % 2 === 0 ? "#f3f4f6" : "#ffffff", // un poquito más sombreado para distinguir items
            }}
        >
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="items">
                    <TableHead>
                    <TableRow>
                        <TableCell sx={headerStyle}>✔</TableCell>
                        <TableCell sx={headerStyle}>Código</TableCell>
                        <TableCell sx={headerStyle}>Nombre</TableCell>
                        <TableCell sx={headerStyle}>Unidad</TableCell>
                        <TableCell sx={headerStyle}>¿Se factura?</TableCell>
                        <TableCell align="right" sx={headerStyle}>
                        Cantidad
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {row.manifestItems.map((item, idx) => (
                        <TableRow
                            key={item.id}
                            sx={{
                                backgroundColor: idx % 2 === 0 ? "#fdfdfd" : "#f5f5f5", // intercalado entre los hijos
                            }}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={manifestSelected?.items.some((i) => i.id === item.item.id) ?? false}
                                onChange={() =>
                                    onToggleItem(row.id, {
                                    id: item.item.id,  // 👈 usar el id real del producto
                                    cantidad: +item.cantidad,
                                    })
                                }
                            />

                        </TableCell>
                        <TableCell>{item.item.code}</TableCell>
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{traslateMedidas(item.item.unidad)}</TableCell>
                        <TableCell>
                            <InvoiceStatusCell
                                isInvoiced={item.isInvoiced}
                                manifestItemId={item.id}
                                refetch={refetch}
                            />
                        </TableCell>
                        <TableCell align="right">{item.cantidad}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        </React.Fragment>
    );
}

function ManifestCommercialTable({ selected, onToggleItem, onToggleManifest, onQuotationCodeChange, manifests, refetch, totalCantidad, totalItems }: ManifestCommercialTableProps) {



    // const {mutate, isPending} = useMutation({
    //     mutationFn: updateManifestItemPrice,
    //     onSuccess: (data) => {
    //         refetch()
    //         toast.success(data)
    //     },
    //     onError: (error) => {
    //         toast.error(error.message)
    //     },
    // });

    return (
        <>
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table" size="small" stickyHeader>
            <TableHead>
                <TableRow>
                <TableCell sx={headerStyle}>✔</TableCell>
                <TableCell sx={headerStyle}>Items</TableCell>
                <TableCell sx={headerStyle}>ID</TableCell>
                <TableCell sx={headerStyle}>Cliente</TableCell>
                <TableCell sx={headerStyle}>Plantilla</TableCell>
                <TableCell sx={headerStyle}>Fecha</TableCell>
                <TableCell sx={headerStyle}>Ubicación</TableCell>
                <TableCell sx={headerStyle}>Facturado</TableCell>
                <TableCell sx={headerStyle}>#-Cot</TableCell>
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

        <div className="p-3 flex justify-between w-full mx-auto">
            <p>
                Total seleccionados: { ' ' }
                <span className="font-bold text-azul">
                    {totalItems} items
                </span>
            </p>
            <p>
                Total Cantidad: { ' ' }
                <span className="font-bold text-azul">
                    {totalCantidad}
                </span>
            </p>
        </div>
        </>
    );
}

export default ManifestCommercialTable;
