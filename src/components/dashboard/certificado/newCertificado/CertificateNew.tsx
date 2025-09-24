"use client";
import {
    ManifestInvoiceSearchFormData,
    PaginationManifestCertificateType,
} from "@/src/types";
import {
    formatDateTimeLarge,
    formatNumber,
    translateMedidasSimbolos,
} from "@/src/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { headerStyle } from "../../manifiesto-comercial/ManifestCommercialTable";
import ManifestInvoiceSearchForm from "../../manifiesto-facturacion/ManifestInvoiceSearchForm";
import { SelectedManifestItems } from "../DashboardCertificate";
import { useMutation } from "@tanstack/react-query";
import { createCertificate } from "@/src/api/certificateApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export type selectedManifestCertificate = {
    id: number;
};

interface CertificateNewProps {
    data: PaginationManifestCertificateType | undefined;
    isLoading: boolean;
    setFilters: Dispatch<SetStateAction<ManifestInvoiceSearchFormData>>;
    selectedState: SelectedManifestItems;
    selectItem: (manifestItemId: number) => void;
    page: number;
    limit: number;
    onChangePage: (event: unknown, newPage: number) => void;
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CertificateNew({ data, isLoading, setFilters, selectedState, selectItem, page, limit, onChangePage, onChangeRowsPerPage }: CertificateNewProps) {

    const router = useRouter()

    function generateCertificateCode() {
        const random = Math.floor(10000 + Math.random() * 90000); // 5 cifras
        const date = dayjs().format("YYYYMMDD");
        return `${random}-${date}`;
    }

    const { mutate, isPending} = useMutation({
        mutationFn: createCertificate,
        onError: (error) => {
            toast.error(error.message || "Error al crear certificado");
        },
        onSuccess: (data) => {
            // Aquí puedes mostrar un mensaje, limpiar selección, etc.
            toast.success("Certificado creado con éxito");
            router.push(`/dashboard/certificado/${data}/view`) // Redirigir al nuevo certificado
        },
    });

    const handleCreateCertificate = () => {

        const code = generateCertificateCode();

        const formData = {
            code,
            clientId: selectedState.clientId,
            itemIds: selectedState.itemIds
        }

        mutate({formData})
    }

    return (
        <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p className="font-bold text-azul text-lg">Nuevo Certificado</p>
            </AccordionSummary>

            <AccordionDetails sx={{ backgroundColor: "#f0f6ff" }}>
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Typography variant="body1" className="text-gray-700 leading-relaxed">
                        Busca{" "}
                        <span className="font-semibold text-azul">
                            servicios o manifiestos
                        </span> empieza buscando por Cliente.
                    </Typography>
                </div>

                <div className="grid grid-cols-1 gap-3 my-5 ">
                    <ManifestInvoiceSearchForm setFilters={setFilters} />
                </div>

                {/* Botón Crear Certificado y contador de seleccionados */}
                {selectedState.itemIds.length > 0 && (
                    <div className="flex justify-between items-center gap-4 mb-4 w-full">
                        <button
                            className="bg-azul w-[80%] text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-800 transition"
                            type="button"
                            onClick={handleCreateCertificate}
                            disabled={isPending}
                        >
                            {isPending ? "Creando..." : "Crear Certificado"}
                        </button>
                        <span className="text-azul font-bold">
                            {selectedState.itemIds.length} item(s) seleccionado(s)
                        </span>
                    </div>
                )}

                {isLoading && (
                    <h2 className="text-azul text-xl text-center font-black mt-10">
                        Cargando Datos...
                    </h2>
                )}

                {data?.manifests.length === 0 && (
                    <h2 className="text-azul text-xl text-center font-black mt-10">
                        No Hay Resultados
                    </h2>
                )}

                {data && data.manifests.length > 0 && (
                    <>
                        <CertificateManifestTable
                            data={data}
                            selectItem={selectItem}
                            selectedState={selectedState}
                        />
                        <TablePagination
                            component="div"
                            count={data.totalPages}
                            page={page}
                            onPageChange={onChangePage}
                            rowsPerPage={limit}
                            onRowsPerPageChange={onChangeRowsPerPage}
                            rowsPerPageOptions={[10, 20, 50]}
                        />
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
}

type Props = {
    data: PaginationManifestCertificateType;
    selectedState: SelectedManifestItems
    selectItem: (manifestItemId: number) => void
    // onPageChange: (page: number) => void;
};

export function CertificateManifestTable({ data, selectItem, selectedState }: Props) {
    // const [page, setPage] = useState(data.currentPage - 1);
    const [openRow, setOpenRow] = useState<number | null>(null);

    // const handleChangePage = (_: unknown, newPage: number) => {
    //     setPage(newPage);
    //     onPageChange(newPage + 1);
    // };

    return (
        <Box sx={{ p: 2 }}>
        <TableContainer>
            <Table size="small" stickyHeader>
            <TableHead>
                <TableRow>
                <TableCell sx={{ ...headerStyle, width: 60 }}>Items</TableCell>
                <TableCell sx={{ ...headerStyle, width: 70 }}>ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Cliente</TableCell>
                <TableCell sx={{ ...headerStyle, width: 250 }}>Plantilla </TableCell>
                <TableCell sx={{ ...headerStyle, width: 120 }}>Fecha</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>Ubicación </TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>#-Cot</TableCell>
                <TableCell sx={{ ...headerStyle, width: 100 }}>#-Fact</TableCell>
                </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: "white" }}>
                {data.manifests.map((manifest) => (
                <React.Fragment key={manifest.id}>
                    <TableRow>
                    <TableCell>
                        <IconButton
                        size="small"
                        onClick={() =>
                            setOpenRow(openRow === manifest.id ? null : manifest.id)
                        }
                        >
                        {openRow === manifest.id ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {formatNumber(manifest.id)}
                    </TableCell>
                    <TableCell>
                        <span className="uppercase">{manifest.cliente.alias}</span>
                    </TableCell>
                    <TableCell
                        sx={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        textTransform: "uppercase",
                        }}
                    >
                        {manifest.manifestTemplate?.name}
                    </TableCell>
                    <TableCell>{formatDateTimeLarge(manifest.date)}</TableCell>
                    <TableCell>{manifest.location ?? "Sin ubicación"}</TableCell>
                    <TableCell>{manifest.quotationCode ?? "----"}</TableCell>
                    <TableCell>{manifest.invoiceCode ?? "----"}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={8}
                    >
                        <Collapse
                        in={openRow === manifest.id}
                        timeout="auto"
                        unmountOnExit
                        >
                        <Box margin={1}>
                            {/* Agrupar items por categoría */}
                            {Object.entries(
                            manifest.manifestItems.reduce<
                                Record<string, typeof manifest.manifestItems>
                            >((acc, item) => {
                                const categoria =
                                item.item.categoria || "Sin categoría";
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
                                        <TableCell sx={{ ...headerStyle, width: 40 }}>✔</TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 60 }}
                                        >
                                        Código
                                        </TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 220 }}
                                        >
                                        Nombre
                                        </TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 60 }}
                                        >
                                        Unidad
                                        </TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 80 }}
                                        >
                                        Cantidad
                                        </TableCell>
                                        {isEspecial && (
                                        <TableCell
                                            sx={{ ...headerStyle, width: 100 }}
                                        >
                                            Vol. Desechos
                                        </TableCell>
                                        )}
                                        {isEspecial && (
                                        <TableCell
                                            sx={{ ...headerStyle, width: 80 }}
                                        >
                                            # Viajes
                                        </TableCell>
                                        )}
                                        {isEspecial && (
                                        <TableCell
                                            sx={{ ...headerStyle, width: 80 }}
                                        >
                                            # Horas
                                        </TableCell>
                                        )}
                                        <TableCell sx={{ ...headerStyle,  }}>Disposición Final</TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 120 }}
                                        >
                                        Tiquete
                                        </TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 140 }}
                                        >
                                        Fecha Disp. Final
                                        </TableCell>
                                        <TableCell
                                        sx={{ ...headerStyle, width: 120 }}
                                        >
                                        Certificado Final
                                        </TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {items.map((item, idx) => (
                                        <TableRow
                                            key={item.id}
                                            sx={{
                                                backgroundColor: idx % 2 === 0 ? '#b0b3b8' : '#d1d5db', // gris alternado para hijos
                                            }}
                                        >
                                        <TableCell>
                                            <Checkbox
                                            size="small"
                                            checked={selectedState.itemIds.some(
                                                (i) => i.manifestItemId === item.id
                                            )}
                                            onChange={() => selectItem(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{item.item.code}</TableCell>
                                        <TableCell>
                                            {" "}
                                            <span className="uppercase text-sm">
                                            {item.item.name}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {translateMedidasSimbolos(
                                            item.item.unidad
                                            )}
                                        </TableCell>
                                        <TableCell>{item.cantidad}</TableCell>
                                        {isEspecial && (
                                            <TableCell>
                                            {item.volDesechos ?? "-"}
                                            </TableCell>
                                        )}
                                        {isEspecial && (
                                            <TableCell>
                                            {item.nViajes ?? "-"}
                                            </TableCell>
                                        )}
                                        {isEspecial && (
                                            <TableCell>
                                            {item.nHoras ?? "-"}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <div className="flex flex-col text-xs gap-1 text-azul leading-tight">
                                                <span className="font-semibold text-azul text-xs border-b">
                                                    {item.disposicionFinal?.sitio?.nombre || "-"}
                                                </span>
                                                <span className="border-b">
                                                    {item.disposicionFinal?.licencia?.licencia || "-"}
                                                </span>
                                                <span style={{color: '#374151'}}>
                                                    {item.disposicionFinal?.tratamiento || "-"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.tiquete ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            {item.fechaDisposicionFinal
                                            ? formatDateTimeLarge(
                                                item.fechaDisposicionFinal
                                                )
                                            : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {item.certificadoFinal ?? "-"}
                                        </TableCell>
                                        
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
        {/* <TablePagination
                    component="div"
                    count={data.total}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                /> */}
        </Box>
    );
}

export default CertificateNew;
