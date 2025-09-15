"use client";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface GoBackButtonProps {
    label?: string;
    fullWidth?: boolean;
}

export default function GoBackButtonMUI({ label = "Volver", fullWidth = false }: GoBackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            fullWidth={fullWidth}
            onClick={() => router.back()}
            sx={{
                // borderRadius: "16px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
            }}
        >
        {label}
        </Button>
    );
}
