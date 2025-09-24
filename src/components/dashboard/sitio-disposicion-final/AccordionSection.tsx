import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode } from 'react';

interface AccordionSectionProps {
    title: string;
    children: ReactNode;
    expanded?: boolean;
}

export function AccordionSection({ title, children, expanded }: AccordionSectionProps) {
    return (
        <Accordion
            expanded={expanded}
        >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className='text-azul font-bold'>{title}</h2>
        </AccordionSummary>
        <AccordionDetails>
            {children}
        </AccordionDetails>
        </Accordion>
    );
}
