"use client";

import { updateManifestItemPrice } from "@/src/api/manifestApi";
import { ManifestCommerceType, PaginationManifestCommercialType } from "@/src/types";
import { formatDateTimeLarge, formatNumber } from "@/src/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "react-toastify";
import ManifestInputPriceUpdate from "./ManifestInputPriceUpdate copy";
import ManifestInputUpdate from "./ManifestInputUpdate";


type ManifestCommercialTableProps = {
    manifests: ManifestCommerceType[];
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>
};

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

type selectedItem = {
    id: number          
    manifestItemId: number
    cantidad: number
    price: string | null
}

type selectedManifest ={
    id: number
    items: selectedItem[]
}

export type ManifestItemPriceType = {
    manifestItemId: number;
    price: string;
};


function Row({
    row,
    selected,
    onToggleManifest,
    onToggleItem,
    refetch,
    onPriceChange
}: {
    row: ManifestCommerceType;
    selected: selectedManifest[]
    onToggleManifest: (manifestId: number, items: selectedItem[]) => void
    onToggleItem: (manifestId: number, item: selectedItem) => void
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<PaginationManifestCommercialType | undefined, Error>>
    onPriceChange: (newPrice: string) => void
}) {
    const [open, setOpen] = React.useState(false);

    const manifestSelected = selected.find((manifest) => manifest.id === row.id);

    const allItemsSelected = manifestSelected
    ? row.manifestItems.every((i) =>
            manifestSelected.items.some((sel) => sel.id === i.id)
        )
    : false;

    const someItemsSelected = manifestSelected
        ? row.manifestItems.some((i) =>
            manifestSelected.items.some((sel) => sel.id === i.id)
            ) && !allItemsSelected
    : false;

    return (
        <React.Fragment>
        {/* Fila principal (manifiesto) */}
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell padding="checkbox">
            <Checkbox
                checked={allItemsSelected}
                indeterminate={someItemsSelected}
                onChange={() =>
                onToggleManifest(
                    row.id,
                    row.manifestItems.map((i) => ({
                        id: i.item.id,
                        manifestItemId: i.id,
                        cantidad: +i.cantidad,
                        price: i.price
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
            <TableCell>{row.isInvoiced ? "Facturado ✅" : "Pendiente ❌"}</TableCell>
            <TableCell>
                <ManifestInputUpdate
                    manifestId={row.id}
                    invoiceCode={row.invoiceCode}
                    refetch={refetch}
                />
            </TableCell>
        </TableRow>

        {/* Fila expandible con items */}
        <TableRow>
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
                        <TableCell align="right" sx={headerStyle}>
                        Cantidad
                        </TableCell>
                        <TableCell sx={headerStyle}>
                        Precio X (Uniudad)
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {row.manifestItems.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell padding="checkbox">
                        <Checkbox
                        checked={manifestSelected?.items.some((i) => i.manifestItemId === item.id) ?? false}
                        onChange={() =>
                            onToggleItem(row.id, { 
                                id: row.id, // manifestId
                                manifestItemId: item.id,
                                cantidad: +item.cantidad,
                                price: item.price
                            })
                        }
/>
                        </TableCell>
                        <TableCell>{item.item.code}</TableCell>
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.unidad}</TableCell>
                        <TableCell align="right">{item.cantidad}</TableCell>
                        <TableCell>
                            <ManifestInputPriceUpdate
                                price={
                                    manifestSelected?.items.find((i) => i.manifestItemId === item.id)?.price ?? item.price
                                }
                                onPriceChange={onPriceChange}
                            />
                        </TableCell>
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

function ManifestCommercialTable({ manifests, refetch }: ManifestCommercialTableProps) {

    const [selected, setSelected] = React.useState<selectedManifest[]>([]);

    const {mutate, isPending} = useMutation({
        mutationFn: updateManifestItemPrice,
        onSuccess: (data) => {
            refetch()
            toast.success(data)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    });

    // ✅ Cambiar precio en TODOS los seleccionados
    const handlePriceChange = (newPrice: string) => {
        setSelected(prev =>
            prev.map(manifest => ({
            ...manifest,
            items: manifest.items.map(item => ({
                ...item,
                price: newPrice
            }))
            }))
        );
    };

    // ✅ Seleccionar/deseleccionar todo el manifiesto
    const handleToggleManifest = (
    manifestId: number,
    items: selectedItem[]
    ) => {
    setSelected((prev) => {
        const manifestIndex = prev.findIndex((m) => m.id === manifestId);

        if (manifestIndex === -1) {
        // 🚀 No existe → lo agregamos con todos los items
        return [...prev, { id: manifestId, items }];
        }

        const newSelected = [...prev];
        const manifest = newSelected[manifestIndex];

        if (manifest.items.length === items.length) {
        // ✅ Ya tenía todos los items → lo quitamos
        newSelected.splice(manifestIndex, 1);
        } else {
        // ✅ Reemplazamos con todos los items (incluyendo price)
        newSelected[manifestIndex] = { id: manifestId, items };
        }

        return newSelected;
    });
    };

    // ✅ Seleccionar/deseleccionar item individual
    const handleToggleItem = (
    manifestId: number,
    item: selectedItem
    ) => {
    setSelected((prev) => {
        const manifestIndex = prev.findIndex((m) => m.id === manifestId);

        if (manifestIndex === -1) {
        // 🚀 No existe → agregamos este item
        return [...prev, { id: manifestId, items: [item] }];
        }

        const newSelected = [...prev];
        const manifest = { ...newSelected[manifestIndex] };
        const items = [...manifest.items];

        // Verificamos si ya estaba seleccionado
        const itemIndex = items.findIndex((i) => i.manifestItemId === item.manifestItemId);

        if (itemIndex === -1) {
        // 🚀 No estaba → lo agregamos
        manifest.items = [...items, item];
        } else {
        // 🚀 Ya estaba → lo quitamos
        manifest.items = items.filter((i) => i.manifestItemId !== item.manifestItemId);
        }

        if (manifest.items.length === 0) {
        newSelected.splice(manifestIndex, 1);
        } else {
        newSelected[manifestIndex] = manifest;
        }

        return newSelected;
    });
    };


    const totalCantidad = selected.reduce(
        (sum, manifest) =>
            sum + manifest.items.reduce((s, i) => s + i.cantidad, 0),
        0
    );

    const totalItems = selected.reduce(
        (sum, manifest) => sum + manifest.items.length,
        0
    );

    return (
        <div className="w-full overflow-x-auto rounded-md shadow py-5 flex flex-col gap-2">

        <Button
            variant="contained"
            color="success"
            size="small"
            disabled={isPending || selected.length === 0}
            startIcon={<SaveIcon />}
            onClick={() => {
                // construimos payload
                const manifestId = selected[0].id.toString(); // 🚨 aquí asumo que actualizas UN manifiesto a la vez
                const manifestItemPriceFormData = selected.flatMap(manifest =>
                manifest.items.map(item => ({
                    manifestItemId: item.manifestItemId,
                    price: item.price || "0",
                }))
                );

                mutate({ manifestId, manifestItemPriceFormData });
            }}
            >
            Guardar precios seleccionados
        </Button>



        {/* <IconButton 
        color="success" 
        size="small"
        onClick={() => {
            const payload = selected.flatMap(manifest =>
            manifest.items.map(item => ({
                manifestItemId: item.manifestItemId,
                price: item.price
            }))
            );
            console.log("📦 Datos a enviar:", payload);
        }}
        >
        <SaveIcon/>
        </IconButton> */}

        
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
                <TableCell sx={headerStyle}>Estado</TableCell>
                <TableCell sx={headerStyle}>Código de Factura</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {manifests.map((m) => (
                <Row
                    key={m.id}
                    row={m}
                    selected={selected}
                    onToggleManifest={handleToggleManifest}
                    onToggleItem={handleToggleItem}
                    refetch={refetch}
                    onPriceChange={handlePriceChange}
                />
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Footer con totales */}
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
        </div>
    );
}

export default ManifestCommercialTable;
