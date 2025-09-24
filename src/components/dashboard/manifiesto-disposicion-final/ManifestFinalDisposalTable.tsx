import { updateManifestItemDisposicionFinalEntregado } from "@/src/api/manifestItemApi";
import { ItemDisposicionFinalForm, ManifestFinalDisposalType, ResponseDisposicionFinalType, ResponseManifestFinalDisposalType } from "@/src/types";
import { formatDateTimeLarge, formatNumber, translateMedidasSimbolos } from "@/src/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    Box,
    Checkbox,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "react-toastify";

const headerStyle = {
    backgroundColor: "#0054a6",
    color: "white",
    fontWeight: "bold",
};

type ManifestFinalDisposalTableProps = {
    manifests: ManifestFinalDisposalType[];
    onSelectItem: (item: ItemDisposicionFinalForm) => void
    selectedItem: ItemDisposicionFinalForm | null
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<ResponseManifestFinalDisposalType | undefined, Error>>
};

function Row({ row, index, onSelectItem, selectedItem, mutateEntregado, isLoadingEntregado }: {
    row: ManifestFinalDisposalType;
    index: number;
    onSelectItem: (item: ItemDisposicionFinalForm) => void;
    selectedItem: ItemDisposicionFinalForm | null;
    mutateEntregado: (vars: { id: number }) => void;
    isLoadingEntregado: boolean;
}) {
    const [open, setOpen] = React.useState(false);

    // Agrupación de items por categoría tipada correctamente
    const grouped = row.manifestItems.reduce<Record<string, typeof row.manifestItems>>((acc, item) => {
        const categoria = item.item.categoria || "Sin categoría";
        if (!acc[categoria]) acc[categoria] = [];
        acc[categoria].push(item);  
        return acc;
    }, {});

        // Función para determinar el color de fondo de cada item
        function getItemBgColor(item: typeof row.manifestItems[number]) {
            const hasDisposicion = !!item.disposicionFinal?.id;
            const hasTiquete = !!item.tiquete;
            const hasFecha = !!item.fechaDisposicionFinal;
            const hasCertificado = !!item.certificadoFinal && item.certificadoFinal !== "-";
            const isEntregado = !!item.entregado;

            // 1. Blanco: todos los datos vacíos
            if (!hasDisposicion && !hasTiquete && !hasFecha && !hasCertificado && !isEntregado) return '#fff';

            // 2. Rojo: solo disposición final (el resto vacío)
            if (hasDisposicion && !hasTiquete && !hasFecha && !hasCertificado && !isEntregado) return '#e53935'; // red[600]

            // 3. Amarillo: disposición final y al menos tiquete o fecha, sin certificado ni entregado
            if (hasDisposicion && (hasTiquete || hasFecha) && !hasCertificado && !isEntregado) return '#fbc02d'; // yellow[700]

            // 4. Naranja: disposición final, tiquete o fecha y certificado, sin entregado
            if (hasDisposicion && (hasTiquete || hasFecha) && hasCertificado && !isEntregado) return '#fb8c00'; // orange[600]

            // 5. Verde: disposición final, tiquete o fecha, certificado y entregado
            if (hasDisposicion && (hasTiquete || hasFecha) && hasCertificado && isEntregado) return '#43a047'; // green[600]

            // Por defecto blanco
            return '#fff';
        }

    function getItemTextColor(item: typeof row.manifestItems[number]) {
        if (item.entregado || (item.certificadoFinal && item.certificadoFinal !== "-") || (item.fechaDisposicionFinal && item.tiquete) || item.disposicionFinal?.id) {
            return '#fff';
        }
        return undefined;
    }

    return (
        <>
            <TableRow
                sx={{
                    "& > *": { borderBottom: "unset" },
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                }}
            >
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
                        whiteSpace: "normal", 
                        wordBreak: "break-word", 
                        overflowWrap: "break-word", 
                        textTransform: "uppercase"
                    }}
                >
                    {row.manifestTemplate?.name}
                </TableCell>
                <TableCell>{formatDateTimeLarge(row.date)}</TableCell>
                <TableCell>{row.location ?? "Sin ubicación"}</TableCell>
                <TableCell>{row.quotationCode || "-----"}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f3f4f6" : "#ffffff" }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {Object.entries(grouped).map(([categoria, items]) => {
                            const isEspecial = categoria === "ESPECIAL";
                            return (
                                <Box key={categoria} sx={{ marginY: 1 }}>
                                    <h4 className="text-md text-center font-semibold p-2 bg-azul text-white print:bg-gray-200 print:text-black print:p-1 print:text-xs">{categoria}</h4>
                                    {isEspecial ? (
                                        <div style={{ overflowX: 'auto', width: '100%' }}>
                                            <Table size="small" aria-label={`items-${categoria}`}
                                                sx={{
                                                    minWidth: 900,
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
                                                        <TableCell sx={{ ...headerStyle, width: 220 }}>Nombre</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 60 }}>Unidad</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 80 }}>Cantidad</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 100 }}>Vol. Desechos</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 80 }}># Viajes</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 80 }}># Minutos</TableCell>
                                                        <TableCell sx={{ ...headerStyle }}>Disposición Final</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 120 }}>Tiquete</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 140 }}>Fecha Disp. Final</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 120 }}>Certificado Final</TableCell>
                                                        <TableCell sx={{ ...headerStyle, width: 80 }}>Entregado</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(items as typeof row.manifestItems).map((item) => (
                                                        <TableRow key={item.id} sx={{ backgroundColor: getItemBgColor(item), color: getItemTextColor(item), '& td, & th': { color: getItemTextColor(item) } }}>
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedItem?.manifestItemId === item.id}
                                                                    color="primary"
                                                                    onChange={() => onSelectItem({
                                                                        manifestItemId: item.id,
                                                                        tiquete: item.tiquete || "",
                                                                        fechaDisposicionFinal: item.fechaDisposicionFinal || "",
                                                                        certificadoFinal: item.certificadoFinal || "",
                                                                        disposicionFinalId: item.disposicionFinal?.id || 0
                                                                    })}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{item.item.code}</TableCell>
                                                            <TableCell> <span className="uppercase text-sm">{item.item.name}</span></TableCell>
                                                            <TableCell>{translateMedidasSimbolos(item.item.unidad)}</TableCell>
                                                            <TableCell>{item.cantidad}</TableCell>
                                                            <TableCell>{item.volDesechos ?? "-"}</TableCell>
                                                            <TableCell>{item.nViajes ?? "-"}</TableCell>
                                                            <TableCell>{item.nHoras ?? "-"}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col text-xs text-white leading-tight">
                                                                    <span className="font-semibold text-white text-xs">{item.disposicionFinal?.sitio.nombre || '-'}</span>
                                                                    <span>{item.disposicionFinal?.licencia.licencia || '-'}</span>
                                                                    <span>{item.disposicionFinal?.tratamiento || '-'}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{item.tiquete ?? "-"}</TableCell>
                                                            <TableCell>{item.fechaDisposicionFinal ? formatDateTimeLarge(item.fechaDisposicionFinal) : "-"}</TableCell>
                                                            <TableCell>{item.certificadoFinal ?? "-"}</TableCell>
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={!!item.entregado}
                                                                    color="success"
                                                                    disabled={isLoadingEntregado}
                                                                    onChange={() => mutateEntregado({ id: item.id })}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <Table size="small" aria-label={`items-${categoria}`}
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
                                                    <TableCell sx={{ ...headerStyle, width: 220 }}>Nombre</TableCell>
                                                    <TableCell sx={{ ...headerStyle, width: 60 }}>Unidad</TableCell>
                                                    <TableCell sx={{ ...headerStyle, width: 80 }}>Cantidad</TableCell>
                                                    <TableCell sx={{ ...headerStyle }}>Disposición Final</TableCell>
                                                    <TableCell sx={{ ...headerStyle, width: 120 }}>Tiquete</TableCell>
                                                    <TableCell sx={{ ...headerStyle, width: 140 }}>Fecha Disp. Final</TableCell>
                                                    <TableCell sx={{ ...headerStyle, width: 120 }}>Certificado Final</TableCell>
                                                    <TableCell sx={{ ...headerStyle, width: 80 }}>Entregado</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(items as typeof row.manifestItems).map((item) => (
                                                    <TableRow key={item.id} sx={{ backgroundColor: getItemBgColor(item), color: getItemTextColor(item), '& td, & th': { color: getItemTextColor(item) } }}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedItem?.manifestItemId === item.id}
                                                                color="primary"
                                                                onChange={() => onSelectItem({
                                                                    manifestItemId: item.id,
                                                                    tiquete: item.tiquete || "",
                                                                    fechaDisposicionFinal: item.fechaDisposicionFinal || "",
                                                                    certificadoFinal: item.certificadoFinal || "",
                                                                    disposicionFinalId: item.disposicionFinal?.id || 0
                                                                })}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{item.item.code}</TableCell>
                                                        <TableCell> <span className="uppercase text-sm">{item.item.name}</span></TableCell>
                                                        <TableCell>{translateMedidasSimbolos(item.item.unidad)}</TableCell>
                                                        <TableCell>{item.cantidad}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col text-xs text-white leading-tight">
                                                                <span className="font-semibold text-white text-xs">{item.disposicionFinal?.sitio.nombre || '-'}</span>
                                                                <span>{item.disposicionFinal?.licencia.licencia || '-'}</span>
                                                                <span>{item.disposicionFinal?.tratamiento || '-'}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.tiquete ?? "-"}</TableCell>
                                                        <TableCell>{item.fechaDisposicionFinal ? formatDateTimeLarge(item.fechaDisposicionFinal) : "-"}</TableCell>
                                                        <TableCell>{item.certificadoFinal ?? "-"}</TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={!!item.entregado}
                                                                color="success"
                                                                disabled={isLoadingEntregado}
                                                                onChange={() => mutateEntregado({ id: item.id })}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </Box>
                            );
                        })}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

function ManifestFinalDisposalTable({ manifests, onSelectItem, selectedItem}: ManifestFinalDisposalTableProps) {
    // const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: updateManifestItemDisposicionFinalEntregado,
        onSuccess: () => {
            toast.success("Estado de entrega actualizado");
            // queryClient.invalidateQueries({ queryKey: ["disposicionFinalManifest"] });
        },
        onError: (error) => {
            toast.error(error.message || "Error al actualizar el estado de entrega");
        }
    });

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table" size="small" stickyHeader sx={{
                "& th, & td": {
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                },
            }}>
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
                    {manifests.map((m, index) => (
                        <Row 
                            key={m.id} 
                            row={m} 
                            index={index} 
                            onSelectItem={onSelectItem}
                            selectedItem={selectedItem}
                            mutateEntregado={mutation.mutate}
                            isLoadingEntregado={mutation.isPending}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ManifestFinalDisposalTable;
