import { FC, useCallback } from "react";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { headerStyle } from "../manifiesto-comercial/ManifestCommercialTable";
import { ResponseDisposicionFinalType, DisposicionFinalSitioType, DisposicionFinalLicenciaType, DisposicionFinalForm } from "@/src/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import DisposicionFinalModal from "./DisposicionFinalModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createDisposicionFinal, deleteDisposicionFinal } from "@/src/api/disposicionFinalApi";
import DisposicionFinalEditModal from "./DisposicionFinalEditModal";

interface DisposicionFinalTableProps {
    loading: boolean;
    data?: ResponseDisposicionFinalType;
    sitios?: DisposicionFinalSitioType[];
    licencias?: DisposicionFinalLicenciaType[];
}


const DisposicionFinalTable: FC<DisposicionFinalTableProps> = ({ loading, data, sitios = [], licencias = [] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const open = searchParams.get("modal") === "disposicionFinal";
    const editId = searchParams.get("editId") || undefined;
    const openEdit = searchParams.get("modal") === "editDisposicionFinal" && !!editId;
    const queryClient = useQueryClient();

    const { handleSubmit, register, reset, formState: { errors } } = useForm<DisposicionFinalForm>({
        defaultValues: { sitioId: 0, licenciaId: 0, tratamiento: 'APROVECHAMIENTO' }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createDisposicionFinal,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["disposicionFinals"] });
            handleClose();
            reset();
        }
    });

    const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
        mutationFn: deleteDisposicionFinal,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["disposicionFinals"] });
        }
    });

    const handleOpenEdit = useCallback((id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("modal", "editDisposicionFinal");
        params.set("editId", id);
        router.push("?" + params.toString());
    }, [router, searchParams]);

    const handleDelete = (id: string) => {
        mutateDelete({ id });
    }

    const handleOpen = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("modal", "disposicionFinal");
        router.push("?" + params.toString());
    }, [router, searchParams]);

    const handleClose = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        router.push("?" + params.toString());
        reset();
    }, [router, searchParams, reset]);

    const handleCreate = (disposicionFinalForm: DisposicionFinalForm) => {
        mutate({ disposicionFinalForm });
    };


    return (
        <>
            <div className="flex justify-end mb-2">
                <Button variant="contained" color="primary" onClick={handleOpen}>Agregar</Button>
            </div>
            {loading && (
                <p className="p-4 font-medium text-azul">Cargando datos...</p>
            )}
            {(!data || !data.disposiciones || data.disposiciones.length === 0) && !loading && (
                <p className="p-4 text-gray-500 text-center mx-auto">No hay datos</p>
            )}
            {data && data.disposiciones && data.disposiciones.length > 0 && (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ ...headerStyle, width: '5%' }}>ID</TableCell>
                                <TableCell sx={{ ...headerStyle, width: '25%' }}>Sitio</TableCell>
                                <TableCell sx={{ ...headerStyle, width: '25%' }}>Licencia</TableCell>
                                <TableCell sx={{ ...headerStyle, width: '25%' }}>Tratamiento</TableCell>
                                <TableCell sx={{ ...headerStyle, width: '20%' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.disposiciones.map((disp, idx) => (
                                <TableRow key={disp.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{disp.sitio?.nombre}</TableCell>
                                    <TableCell>{disp.licencia?.licencia}</TableCell>
                                    <TableCell>{disp.tratamiento}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenEdit(String(disp.id))}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            sx={{ ml: 1 }}
                                            disabled={isPendingDelete}
                                            onClick={() => handleDelete(String(disp.id))}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <DisposicionFinalModal
                open={open}
                onClose={handleClose}
                handleSubmit={handleSubmit(handleCreate)}
                register={register}
                errors={errors}
                loading={isPending}
                sitios={sitios}
                licencias={licencias}
            />
            <DisposicionFinalEditModal
                open={openEdit}
                onClose={handleClose}
                id={editId}
                sitios={sitios}
                licencias={licencias}
            />
        </>
    );
};

export default DisposicionFinalTable;
