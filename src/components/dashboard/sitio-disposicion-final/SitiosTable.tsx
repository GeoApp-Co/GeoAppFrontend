
import { ResponseDisposicionFinalSitioType, SitioForm } from "@/src/types";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FC, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { headerStyle } from "../manifiesto-comercial/ManifestCommercialTable";
import SitioModal from "./SitioModal";
import SitioEditModal from "./SitioEditModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createDisposicionFinalSitio, deleteDisposicionFinalSitio } from "@/src/api/disposicionFinalApi";
import { toast } from "react-toastify";


interface SitiosTableProps {
    loading: boolean;
    data?: ResponseDisposicionFinalSitioType;
}


const SitiosTable: FC<SitiosTableProps> = ({ loading, data }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const page = Number(searchParams.get("sitiosPage") || 1);

    const initialValues : SitioForm = {
        nombre: ""
    };

    const open = searchParams.get("modal") === "sitio";
    const editId = searchParams.get("editId") || undefined;
    const openEdit = searchParams.get("modal") === "editSitio" && !!editId;
    const queryClient = useQueryClient();

    const { handleSubmit, reset, register, formState: { errors } } = useForm<SitioForm>({
        defaultValues: initialValues
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createDisposicionFinalSitio,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalSitios"] });
            handleClose();
            reset();
        }
    });

    const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
        mutationFn: deleteDisposicionFinalSitio,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalSitios"] });
            queryClient.invalidateQueries({ queryKey: ["disposicionFinals"] });
        }
    });


    const handleOpen = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("modal", "sitio");
        params.delete("editId");
        router.push("?" + params.toString());
    }, [router, searchParams]);

    const handleOpenEdit = useCallback((id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("modal", "editSitio");
        params.set("editId", id);
        router.push("?" + params.toString());
    }, [router, searchParams]);


    const handleClose = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        params.delete("editId");
        router.push("?" + params.toString());
    }, [router, searchParams]);

    const handleCreateSitio = (sitioForm : SitioForm) => {
        mutate({ sitioForm })
    }

    const handleDeleteSitio = (id: string) => {
        mutateDelete({ id });
    }

    return (
        <>
        <div className="flex justify-end mb-2">
            <Button variant="contained" color="primary" onClick={handleOpen}>Agregar</Button>
        </div>
        {  loading && 
            <p className="p-4 font-medium text-azul">Cargando datos...</p>
        }
        {!data || !data.sitios || data.sitios.length === 0 && 
            <p className="p-4 text-gray-500 text-center mx-auto">
                No hay datos
            </p>
        }
        {data && data.sitios && data.sitios.length > 0 && 
        <div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{...headerStyle, width: '33%'}}>ID</TableCell>
                            <TableCell sx={{...headerStyle, width: '33%'}}>Nombre</TableCell>
                            <TableCell sx={{...headerStyle, width: '33%'}}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.sitios.map((sitio, index) => (
                            <TableRow key={sitio.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell><p className="uppercase">{sitio.nombre}</p></TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpenEdit(String(sitio.id))}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        sx={{ ml: 1 }}
                                        disabled={isPendingDelete}
                                        onClick={() => handleDeleteSitio(String(sitio.id))}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Pagination
                    count={data.totalPages}
                    page={page}
                    onChange={(_, value) => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("sitiosPage", value.toString());
                        router.push("?" + params.toString());
                    }}
                    color="primary"
                />
            </Stack> */}
        </div>
        }
        <SitioModal
            open={open}
            onClose={handleClose}
            handleSubmit={handleSubmit(handleCreateSitio)}
            register={register}
            errors={errors}
            loading={isPending}
        />
        <SitioEditModal
            open={openEdit}
            onClose={handleClose}
            id={editId}
        />
        </>
    );
};

export default SitiosTable;
