import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                          className = ''
                                                      }) => {
    const getPageNumbers = (): (number | string)[] => {
        const pageNumbers: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            if (currentPage > 3) {
                pageNumbers.push('...');
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }

            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    if (totalPages <= 0) return null;

    return (
        <div className={`flex items-center justify-center gap-1 font-sans ${className}`}>
            {/* Previous page button */}
            <button
                className="min-w-8 h-8 px-3 flex items-center justify-center border border-gray-200 bg-white text-gray-700 text-sm rounded-md cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
            >
                &lt;
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
                {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="min-w-8 h-8 px-1.5 flex items-center justify-center text-gray-500 text-sm"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            className={`min-w-8 h-8 px-1.5 flex items-center justify-center border rounded-md text-sm transition-all cursor-pointer ${
                                currentPage === page
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                            onClick={() => onPageChange(page as number)}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next page button */}
            <button
                className="min-w-8 h-8 px-3 flex items-center justify-center border border-gray-200 bg-white text-gray-700 text-sm rounded-md cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;