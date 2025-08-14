import { Box, Button, Modal } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';

function SignatureModal({ open, onClose, onSave }: {
    open: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
    }) {
    const canvasRef = useRef<SignatureCanvas>(null);

    const handleSave = () => {
        const url = canvasRef.current?.getTrimmedCanvas().toDataURL('image/png');

        if (url) {
            onSave(url); // lo puedes guardar en el useState o enviar por API
        }

        onClose(); // cerrar el modal
    };

    const handleClear = () => canvasRef.current?.clear();

    return (
        <Modal open={open} onClose={onClose}>
        <Box sx={{ p: 2, bgcolor: 'white', m: 'auto', mt: '10%', width: 400,}}>
            <SignatureCanvas
                ref={canvasRef}
                penColor="black"
                canvasProps={{
                    className: "border border-azul-300 rounded-md w-full h-28 bg-white"
                }}
            />
            <div className='mt-2 flex justify-between'> 
            <Button 
                onClick={handleClear}
                variant='contained'
                color='error'
            >Borrar</Button>
            <Button 
                onClick={handleSave}
                variant='contained'
                color='success'
            >Guardar</Button>

            </div>
        </Box>
        </Modal>
    );
    }

type ButtonSignaturePorps =  {
    input: string
}

function ButtonSignature( { input } : ButtonSignaturePorps) {

    const { setValue } = useFormContext()

    const [openModal, setOpenModal] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);

    useEffect(() => {
        setValue(input, signature)
    }, [setValue, signature, input])
    

    return (
        <div>
        <Button 
            onClick={() => setOpenModal(true)}
            variant='contained'
        >Firmar</Button>

        {signature && (
            <div
                className="border rounded w-full aspect-[3/1]  mt-2 relative"
            >
                <Image
                    src={signature}
                    alt="Firma digital"
                    fill
                />

            </div>
        )}

        <SignatureModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={(dataUrl) => setSignature(dataUrl)}
        />
        </div>
    )


    // return (
    //     <div>
    //     <SignatureCanvas
    //         ref={signatureRef}
    //         penColor="black"
    //         canvasProps={{
    //             className: "border-2 border-gray-300 rounded-md w-full h-28 bg-white"
    //         }}

    //     />
    //     <button onClick={handleClear}>Borrar</button>
    //     {/* <button onClick={handleSave}>Guardar</button> */}
    //     </div>
    // );
}

export default ButtonSignature;