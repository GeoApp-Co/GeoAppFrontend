"use client";

import { ManifestCertificateType } from "@/src/types";
import { formatDateTimeLarge, formatNumber, traslateMedidas } from "@/src/utils";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
import * as React from "react";
import { selectedManifestCertificate } from "./newCertificado/CertificateNew";


type ManifestCertificateTableProps = {
    manifests: ManifestCertificateType[];
    onToggleManifest: (manifestId: number) => void
    onToggleManifests: (manifestIds: number[]) => void
    selected: selectedManifestCertificate[]
};

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};


function Row({
    row,
    onToggleManifest,
    selected,
    index
}: {
    row: ManifestCertificateType;
    onToggleManifest: (manifestId: number) => void
    selected: selectedManifestCertificate[]
    index: number
}) {
    const [open, setOpen] = React.useState(false);

    const seletedManifest = selected.find(manifest => manifest.id == row.id)

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
                    checked={!!seletedManifest}
                    onChange={() => onToggleManifest(row.id)}
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
            <TableCell
                sx={{
                    maxWidth: 300, // ancho máximo (ajusta a tu gusto)
                    // whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
                >
                {row.manifestTemplate.name}
            </TableCell>
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
            <TableCell>{row.quotationCode || '----|'}</TableCell>
            <TableCell>{row.invoiceCode || '----|'}</TableCell>
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
                        <TableCell sx={headerStyle}>Código</TableCell>
                        <TableCell sx={headerStyle}>Nombre</TableCell>
                        <TableCell sx={headerStyle}>Categoria</TableCell>
                        <TableCell sx={headerStyle}>Unidad</TableCell>
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
                        <TableCell>{item.item.code}</TableCell>
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.categoria}</TableCell>
                        <TableCell>{traslateMedidas(item.item.unidad)}</TableCell>
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

function ManifestCertificateTable({ manifests, onToggleManifest, onToggleManifests, selected }: ManifestCertificateTableProps) {

    const manifestIds = manifests.map((manifest => (manifest.id)))

    const areAllSelected = manifestIds.every((id) =>
        selected.some((m) => m.id === id)
    );

    const areSomeSelected =
        manifestIds.some((id) => selected.some((m) => m.id === id)) && !areAllSelected;

    return (
        <>
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table" size="small" stickyHeader>
            <TableHead>
                <TableRow>
                <TableCell padding="checkbox" sx={headerStyle}>
                    <Checkbox
                        sx={{
                            color: '#fff',                               
                            '&.Mui-checked': { color: '#fff' },          
                            '&.MuiCheckbox-indeterminate': { color: '#fff' }, 
                            '& .MuiSvgIcon-root': { fontSize: 22, filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.4))' },
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
                        }}
                        checked={areAllSelected}
                        indeterminate={areSomeSelected}
                        onChange={() => onToggleManifests(manifestIds)}
                    />
                </TableCell>
                <TableCell sx={headerStyle}>Items</TableCell>
                <TableCell sx={headerStyle}>ID</TableCell>
                <TableCell sx={headerStyle}>Cliente</TableCell>
                <TableCell sx={headerStyle}>Plantilla</TableCell>
                <TableCell sx={headerStyle}>Fecha</TableCell>
                <TableCell sx={headerStyle}>Ubicación</TableCell>
                <TableCell sx={headerStyle}>Facturado</TableCell>
                <TableCell sx={headerStyle}>#-Cot</TableCell>
                <TableCell sx={headerStyle}>#-Fat</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                {manifests.map((m, index) => (
                    <Row
                        key={m.id}
                        row={m}
                        onToggleManifest={onToggleManifest}
                        selected={selected}
                        index={index}
                    />
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
}

export default ManifestCertificateTable;
