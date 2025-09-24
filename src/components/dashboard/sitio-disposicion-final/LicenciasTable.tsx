
import { FC, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createDisposicionFinalLicencia, deleteDisposicionFinalLicencia } from "@/src/api/disposicionFinalApi";
import { LicenciaForm } from "@/src/types";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// ...existing code...
import { headerStyle } from "../manifiesto-comercial/ManifestCommercialTable";
import { ResponseDisposicionFinalLicenciaType } from "@/src/types";
import { useRouter, useSearchParams } from "next/navigation";
import LicenciaModal from "./LicenciaModal";
import { toast } from "react-toastify";
import LicenciaEditModal from "./LicenciaEditModal";


interface LicenciasTableProps {
    loading: boolean;
    data?: ResponseDisposicionFinalLicenciaType;
}


const LicenciasTable: FC<LicenciasTableProps> = ({ loading, data }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const page = Number(searchParams.get("licenciasPage") || 1);

    const open = searchParams.get("modal") === "licencia";
    const editId = searchParams.get("editId") || undefined;
    const openEdit = searchParams.get("modal") === "editLicencia" && !!editId;
    const queryClient = useQueryClient();
    const initialValues: LicenciaForm = { licencia: "" };
    const { handleSubmit, reset, register, formState: { errors } } = useForm<LicenciaForm>({
        defaultValues: initialValues
    });

    const mutation = useMutation({
        mutationFn: createDisposicionFinalLicencia,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalLicencias"] });
            handleClose();
            reset();
        }
    });

    const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
        mutationFn: deleteDisposicionFinalLicencia,
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["disposicionFinalLicencias"] });
            queryClient.invalidateQueries({ queryKey: ["disposicionFinals"] });
        }
    });

    const handleCreateLicencia = (licenciaForm: LicenciaForm) => {
        mutation.mutate({ licenciaForm });
    };

    const handleDeleteLicencia = (id: string) => {
        mutateDelete({ id });
    }


    const handleOpen = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("modal", "licencia");
        params.delete("editId");
        router.push("?" + params.toString());
    }, [router, searchParams]);

    const handleOpenEdit = useCallback((id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("modal", "editLicencia");
        params.set("editId", id);
        router.push("?" + params.toString());
    }, [router, searchParams]);

    const handleClose = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        params.delete("editId");
        router.push("?" + params.toString());
    }, [router, searchParams]);


    return (
        <>
        <div className="flex justify-end mb-2">
            <Button variant="contained" color="primary" onClick={handleOpen}>Agregar</Button>
        </div>
        {  loading && 
            <p className="p-4 font-medium text-azul">Cargando datos...</p>
        }
        {!data || !data.licencias || data.licencias.length === 0 && 
            <p className="p-4 text-gray-500 text-center mx-auto">
                No hay datos
            </p>
        }
        {data && data.licencias && data.licencias.length > 0 && 
        <div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{...headerStyle, width: '33%'}}>ID</TableCell>
                            <TableCell sx={{...headerStyle, width: '33%'}}>Licencia</TableCell>
                            <TableCell sx={{...headerStyle, width: '33%'}}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.licencias.map((lic, index) => (
                            <TableRow key={lic.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell><p className="uppercase">{lic.licencia}</p></TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpenEdit(String(lic.id))}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        sx={{ ml: 1 }}
                                        disabled={isPendingDelete}
                                        onClick={() => handleDeleteLicencia(String(lic.id))}
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
                        params.set("licenciasPage", value.toString());
                        router.push("?" + params.toString());
                    }}
                    color="primary"
                />
            </Stack> */}
        </div>
        }
        <LicenciaModal
            open={open}
            onClose={handleClose}
            handleSubmit={handleSubmit(handleCreateLicencia)}
            register={register}
            errors={errors}
            loading={mutation.isPending}
        />
        <LicenciaEditModal
            open={openEdit}
            onClose={handleClose}
            id={editId}
        />
        </>
    );
};

export default LicenciasTable;
