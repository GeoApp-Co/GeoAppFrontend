"use client"

import { getClienteById, getPlantillasByCliente } from "@/src/api/clientApi"
import { deleteNps, getNpsByClienteId } from "@/src/api/npsApi"
import GoBackButton from "@/src/UI/GoBackButton"
import LoaderPage from "@/src/UI/loaders/LoaderPage"
import { translateIdentificacionTypeLong, translatePersonaType } from "@/src/utils"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { CircularProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import Button from "@mui/material/Button"
import Rating from "@mui/material/Rating"
import { useMutation, useQueries, useQuery } from "@tanstack/react-query"
import { differenceInDays } from "date-fns"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import NpsCreateDialog from "./NpsCreateDialog"
import NpsEditDialog from "./NpsEditDialog"


type ClienteViewByIdProps = {
    id: string
}

function ClienteViewById({ id }: ClienteViewByIdProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["cliente", id],
        queryFn: () => getClienteById({ clienteId: id }),
    });

    // PAGINACIÓN NPS
    const [npsPage, setNpsPage] = useState(1);
    const npsLimit = 10;
    const results = useQueries({
        queries: [
            {
                queryKey: ["nps", id, npsPage, npsLimit],
                queryFn: () => getNpsByClienteId({ clienteId: Number(id), page: npsPage, limit: npsLimit }),
                enabled: !!id && data !== undefined,
            },
            {
                queryKey: ["plantillas", id],
                queryFn: () => getPlantillasByCliente({ clienteId: id }),
                enabled: !!id && data !== undefined
            },
        ],
    });
    const [npsQuery, plantillasQuery] = results;
    const npsData = npsQuery.data;
    const isLoadingNps = npsQuery.isLoading;
    const plantillas = plantillasQuery.data;
    const isLoadingPlantillas = plantillasQuery.isLoading;

    const handleNpsPageChange = (_: unknown, value: number) => {
        setNpsPage(value);
    };

    const router = useRouter();
    const searchParams = useSearchParams();
    const openCreateNps = searchParams.get("modal") === "crear-nps";
    const openEditNps = searchParams.get("modal") === "editar-nps";
    const npsId = searchParams.get("id");

    const handleOpenCreateNps = () => {
        router.push(`?modal=crear-nps`, { scroll: false });
    };
    const handleOpenEditNps = (npsId: number) => {
        router.push(`?modal=editar-nps&id=${npsId}`, { scroll: false });
    }
    const handleCloseModal = () => {
        router.push(`?`, { scroll: false });
    };

    // Mutación para eliminar NPS
    const { mutate: mutateDeleteNps, isPending: isDeleting } = useMutation({
        mutationFn: deleteNps,
        onSuccess: (data) => {
            toast.success(data);
            npsQuery.refetch();
        },
        onError: (data) => {
            toast.error(data?.message || "Error al eliminar NPS");
        }
    });

    const handleDeleteNps = (npsId: number) => {
        if (window.confirm("¿Seguro que deseas eliminar esta NPS?")) {
            mutateDeleteNps({ id: npsId, clienteId: Number(id) });
        }
    };

    if (isLoading) return <LoaderPage />;
    if (!data && !isLoading) {
        notFound();
    }


    return (
        <div className=" mx-auto mt-10 p-3 bg-white shadow-lg rounded-md space-y-6">
            {/* Header con botón atrás */}
            <div className="flex justify-between">
                <h1 className="text-lg font-semibold text-azul">Detalle del Cliente</h1>
                <GoBackButton />
            </div>

            {/* Card de datos del cliente */}
            {data && (
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-azul font-medium text-base mb-4">Datos del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-700">Nombre</p>
                            <p className="text-gray-600">{data.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Alias</p>
                            <p className="text-gray-600">{data.alias}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Tipo de Persona</p>
                            <p className="text-gray-600">{translatePersonaType(data.personaType)}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Identificación</p>
                            <p className="text-gray-600">
                                {translateIdentificacionTypeLong(data.identificacionType)} {data.identificacion}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Correo</p>
                            <p className="text-gray-600">{data.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Ubicación</p>
                            <p className="text-gray-600">{data.ubicacion}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Contacto</p>
                            <p className="text-gray-600">{data.contacto || '-'}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Teléfono 1</p>
                            <p className="text-gray-600">{data.phone1}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Teléfono 2</p>
                            <p className="text-gray-600">{data.phone2}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="font-semibold text-gray-700">Dirección</p>
                            <p className="text-gray-600">{data.direccion}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Card de servicios prestados */}
            <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-azul font-medium text-base mb-4">Servicios/Manifiestos asociados</h2>
                {/* Plantillas asociadas */}
                <div className="mt-4">
                    {isLoadingPlantillas ? (
                        <div className="flex justify-center items-center h-12"><CircularProgress size={20} /></div>
                    ) : plantillas && plantillas.length > 0 ? (
                        <ul className="list-disc pl-5 text-sm">
                            {plantillas.map((p) => (
                                <li className="uppercase" key={p.id}>{p.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-xs">No hay plantillas asociadas.</p>
                    )}
                </div>
            </div>

            {/* Tabla de NPS */}
            <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-azul font-medium text-base">Encuestas NPS</h2>
                    <Button variant="contained" color="primary" size="small" onClick={handleOpenCreateNps}>
                        Crear NPS
                    </Button>
                </div>
                {isLoadingNps ? (
                    <div className="flex justify-center items-center h-24"><CircularProgress /></div>
                ) : npsData && npsData.nps.length > 0 ? (
                    <>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Persona</TableCell>
                                        <TableCell>Cargo</TableCell>
                                        <TableCell>Encuestado</TableCell>
                                        <TableCell>Fecha Encuesta</TableCell>
                                        <TableCell>Puntaje</TableCell>
                                        <TableCell>Periodo</TableCell>
                                        <TableCell>Próxima Fecha</TableCell>
                                        <TableCell>Observaciones</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {npsData.nps.map((nps) => (
                                        <TableRow key={nps.id}>
                                            <TableCell>{nps.personaEncuestada}</TableCell>
                                            <TableCell>{nps.cargo}</TableCell>
                                            <TableCell>{nps.encuestado ? "Sí" : "No"}</TableCell>
                                            <TableCell>{new Date(nps.fechaEncuesta).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {/* Puntaje visualizado con estrellas */}
                                                    <Rating
                                                        value={Number(nps.puntaje)}
                                                        precision={0.5}
                                                        max={5}
                                                        readOnly
                                                        sx={{
                                                            fontSize: 24,
                                                            color: '#2563eb',
                                                            '& .MuiRating-iconFilled': {
                                                                color: '#2563eb',
                                                            },
                                                            '& .MuiRating-iconHover': {
                                                                color: '#1e40af',
                                                            },
                                                        }}
                                                    />
                                                    <span className="ml-2 text-base font-bold text-azul">{nps.puntaje}</span>
                                                </div>
                                                
                                            </TableCell>
                                            <TableCell>{nps.periodo}</TableCell>
                                            <TableCell>
                                                {/* Próxima fecha y cuenta regresiva */}
                                                <div className="flex flex-col">
                                                    <span>{new Date(nps.proximaFecha).toLocaleDateString()}</span>
                                                    <span className="text-xs text-gray-500 font-semibold">
                                                        {(() => {
                                                            const dias = differenceInDays(new Date(nps.proximaFecha), new Date());
                                                            if (dias > 0) return `Faltan ${dias} días`;
                                                            if (dias === 0) return "¡Es hoy!";
                                                            return `Hace ${Math.abs(dias)} días`;
                                                        })()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{nps.observaciones || "-"}</TableCell>
                                            <TableCell>
                                                {/* Acciones: editar, eliminar */}
                                                <div className="flex items-center gap-1 flex-col">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    fullWidth
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleOpenEditNps(nps.id)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    fullWidth
                                                    startIcon={<DeleteIcon />}
                                                    className="ml-2"
                                                    onClick={() => handleDeleteNps(nps.id)}
                                                    disabled={isDeleting}
                                                >
                                                    Eliminar
                                                </Button>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="flex justify-center mt-4">
                            <Pagination
                                count={npsData.totalPages}
                                page={npsData.currentPage}
                                onChange={handleNpsPageChange}
                                color="primary"
                                shape="rounded"
                                size="small"
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600 text-sm">No hay encuestas NPS registradas.</p>
                )}
                {/* Modal para crear NPS */}
                <NpsCreateDialog
                    open={openCreateNps}
                    onClose={handleCloseModal}
                    clienteId={Number(id)}
                    onRefresh={() => npsQuery.refetch()}
                />
                <NpsEditDialog
                    open={openEditNps}
                    onClose={handleCloseModal}
                    npsId={npsId}
                    clienteId={Number(id)}
                    onRefresh={() => npsQuery.refetch()}
                />

            </div>
        </div>
    );
}

export default ClienteViewById
