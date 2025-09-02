import { Dispatch, SetStateAction } from "react";

type ItemsFormPaginationProps = {
    page: number
    totalPages: number
    setPage: Dispatch<SetStateAction<number>>
}

function ItemsFormPagination({ page, totalPages, setPage }: ItemsFormPaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center py-10 gap-2 font-bold">
        {page > 1 && (
            <button
            type="button"
            onClick={() => setPage(page - 1)}
            className="bg-white px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300"
            >
            &laquo;
            </button>
        )}

        {pages.length > 6 ? (
            <>
            {pages.slice(0, 3).map((currentPage) => (
                <button
                type="button"
                key={currentPage}
                onClick={() => setPage(currentPage)}
                className={`${
                    page === currentPage ? "font-black bg-azul text-white" : "bg-white text-azul"
                } px-4 py-2 text-sm ring-1 ring-inset ring-gray-300`}
                >
                {currentPage}
                </button>
            ))}

            {pages.slice(3, -3).includes(page) ? (
                <>
                <span className="px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300">...</span>
                <span className="bg-azul px-4 py-2 text-sm text-white ring-1 ring-inset ring-gray-300">
                    {page}
                </span>
                <span className="px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300">...</span>
                </>
            ) : (
                <span className="px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300">...</span>
            )}

            {pages.slice(-3).map((currentPage) => (
                <button
                type="button"
                key={currentPage}
                onClick={() => setPage(currentPage)}
                className={`${
                    page === currentPage ? "font-black bg-azul text-white" : "bg-white text-azul"
                } px-4 py-2 text-sm ring-1 ring-inset ring-gray-300`}
                >
                {currentPage}
                </button>
            ))}
            </>
        ) : (
            pages.map((currentPage) => (
            <button
                type="button"
                key={currentPage}
                onClick={() => setPage(currentPage)}
                className={`${
                page === currentPage ? "font-black bg-azul text-white" : "bg-white text-azul"
                } px-4 py-2 text-sm ring-1 ring-inset ring-gray-300`}
            >
                {currentPage}
            </button>
            ))
        )}

        {page < totalPages && (
            <button
            type="button"
            onClick={() => setPage(page + 1)}
            className="bg-white px-4 py-2 text-sm text-azul ring-1 ring-inset ring-gray-300"
            >
            &raquo;
            </button>
        )}
        </nav>
    );
}


export default ItemsFormPagination
