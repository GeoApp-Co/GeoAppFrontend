"use client"

import { NewManifestFormType } from '@/src/types'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useFormContext, UseFormSetValue } from 'react-hook-form'
import { TbPhotoPlus } from 'react-icons/tb'

type ButtonImageUploadProps = {
    images?: string[]
    setValue: UseFormSetValue<NewManifestFormType>;

}

function ButtonImageUpload({ images }: ButtonImageUploadProps) {

    const [imagesUrl, setImagesUrl] = useState<string[]>(images || [])
    const { setValue } = useFormContext<NewManifestFormType>()

    const handleRemoveImage = (indexToRemove: number) => {
        setImagesUrl(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    useEffect(() => {
        setValue('photos', imagesUrl)
    }, [setValue, imagesUrl])
    

    return (
        <CldUploadWidget
        uploadPreset='Quiosco'
        onSuccess={(result, {  }) => {
            if (result.event === 'success') {
            // widget.close()
            // @ts-expect-error: result.info type is not defined by next-cloudinary, but secure_url exists at runtime
            setImagesUrl(prev => [...prev, result.info.secure_url])
            }
        }}
        options={{
            maxFiles: 3,
            multiple: true,
        }}
        >
        {({ open }) => (
            <>
            <div className='space-y-2'>
                <label className="text-azul font-bold block text-sm mb-1">Imagen de Evidencias</label>
                <div
                className='relative cursor-pointer hover:opacity-75 transition p-10 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 bg-white mt-1 rounded-xl'
                onClick={() => open()}
                >
                <TbPhotoPlus size={50} />
                <p className='text-lg font-semibold'>Agregar Imágenes</p>
                </div>
            </div>

            {imagesUrl.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                {imagesUrl.map((url, index) => (
                    <div key={index} className='relative w-full h-64'>
                    <Image
                        fill
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        style={{ objectFit: 'contain' }}
                    />
                    <button
                        type="button"
                        className='absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-sm hover:bg-red-700'
                        onClick={() => handleRemoveImage(index)}
                    >
                        Eliminar
                    </button>

                    </div>
                ))}
                </div>
            )}

            </>
        )}
        </CldUploadWidget>
    )
}

export default ButtonImageUpload