
import Heading from '@/src/UI/Heading'
import Link from 'next/link'

function NotFound() {
    return (
        <div className='text-center'>
            <Heading>Plantilla no Encontrado</Heading>

            <Link
                href='/dashboard/plantilla'
                className='bg-indigo-400 text-white px-10 py-3 text-xl font-bold mt-5 inline-block w-full lg:w-auto'
            >Ir a Plantillas</Link>
            
        </div>
    )
}

export default NotFound
