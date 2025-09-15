import { selectedItem, selectedManifest } from "@/src/components/dashboard/manifiesto-comercial/DashboardCommercialManifesto";
import { 
    Box, 
    Card, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails 
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from "react";
import { selectedManifestInvoice } from "@/src/components/dashboard/manifiesto-facturacion/DashboardBillingManifesto";

type CardTotalProps = {
    selectedItems: selectedManifest[] | selectedManifestInvoice[];
    manifestType?: 'quotation' | 'invoice';
};

function CardTotal({ selectedItems, manifestType = 'quotation' }: CardTotalProps) {
    const [expanded, setExpanded] = useState<boolean>(true);

    // Función para normalizar los items según el tipo
    const normalizeItems = (items: selectedManifest[] | selectedManifestInvoice[]) => {
        if (!items || items.length === 0) return [];
        
        return items.flatMap(manifest => 
            manifest.items?.filter((item: selectedItem) => item.isVoiced) || []
        );
    };

    const normalizedItems = normalizeItems(selectedItems);

    const totalsByCategory = normalizedItems.reduce<Record<string, { items: number; cantidad: number }>>(
        (acc, item: selectedItem) => {
            const categoria = item.categoria || 'Sin categoría';
            
            if (!acc[categoria]) {
                acc[categoria] = { items: 0, cantidad: 0 };
            }
            
            acc[categoria].items += 1;
            acc[categoria].cantidad += item.cantidad || 0;
            
            return acc;
        },
        {}
    );

    const totalCantidad = Object.values(totalsByCategory).reduce(
        (sum, cat) => sum + cat.cantidad,
        0
    );

    const totalItems = Object.values(totalsByCategory).reduce(
        (sum, cat) => sum + cat.items,
        0
    );

    const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    // Si no hay items seleccionados, no mostrar el componente
    if (!selectedItems || selectedItems.length === 0 || totalItems === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 1300,
            }}
        >
            <Card
                sx={{
                    minWidth: 300,
                    boxShadow: 4,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                }}
            >
                <Accordion 
                    expanded={expanded} 
                    onChange={handleAccordionChange}
                    sx={{ 
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                        backgroundColor: 'transparent'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            padding: '8px 16px',
                            minHeight: 'auto',
                            '& .MuiAccordionSummary-content': {
                                margin: '8px 0',
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                Resumen Selección {manifestType === 'invoice' ? '(Facturación)' : '(Cotización)'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    <strong>Ítems:</strong> {totalItems}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    <strong>Cantidades:</strong> {totalCantidad.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    
                    <AccordionDetails sx={{ padding: '0 16px 16px' }}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Categoría
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Ítems
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Cantidades
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries(totalsByCategory).map(([categoria, data]) => (
                                        <tr key={categoria} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {categoria}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {data.items}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {data.cantidad.toFixed(1)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Box>
    );
}

export default CardTotal;