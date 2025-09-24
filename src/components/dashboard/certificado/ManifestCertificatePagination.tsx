import Link from "next/link"

type ManifestCertificatePaginationProps = {
    page: number
    totalPages: number
}

function ManifestCertificatePagination( { page, totalPages } : ManifestCertificatePaginationProps) {

    const pages = Array.from({length: totalPages}, (_, i) => i+1 )

    return (
        <nav className="flex justify-center py-10 gap-2 font-bold">
            {page > 1 && (
                <Link
                    className="bg-white px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                    href={`/dashboard/certificado?page=${page - 1}`}
                >
                    &laquo;
                </Link>
            )}


            {pages.length > 6 ? (
                <>
                {pages.slice(0, 3).map((currentPage) => (
                    <Link
                        key={currentPage}
                        className={`${page === currentPage ? 'font-black bg-azul text-white' : 'bg-white text-azul'}   px-4 py-2 text-sm ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                        href={`/dashboard/certificado?page=${currentPage}`}
                    >
                        {currentPage}
                    </Link>
                ))}

                { pages.slice(3, -3).includes(page) ? (
                    <>
                        <span className="px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">...</span>

                        <span className="bg-azul px-4 py-2 text-sm text-white ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                            {page}
                        </span>

                        <span className="px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">...</span>
                    </>
                ) : (
                    <>
                        <span className="px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">...</span>
                    </>
                )}

                {pages.slice(-3).map((currentPage) => (
                    <Link
                        key={currentPage}
                        className={`${page === currentPage ? 'font-black bg-azul text-white' : 'bg-white text-azul'}   px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                        href={`/dashboard/certificado?page=${currentPage}`}
                    >
                        {currentPage}
                    </Link>
                ))}
                </>
            ) : (
                pages.map((currentPage) => (
                    <Link
                        key={currentPage}
                        className={`${page === currentPage ?'font-black bg-azul text-white' : 'bg-white text-azul'}   px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                        href={`/dashboard/certificado?page=${currentPage}`}
                    >
                        {currentPage}
                    </Link>
                ))
            )}

            {page < totalPages && (
                <Link
                    className="bg-white px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                    href={`/dashboard/certificado?page=${page + 1}`}
                >
                    &raquo;
                </Link>
            )}
        </nav>
    )
}

export default ManifestCertificatePagination
