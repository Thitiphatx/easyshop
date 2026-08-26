import React from 'react'
import clsx from 'clsx'
import { IPaginationProps } from './interface'

const Pagination: React.FC<IPaginationProps> = ({ page, total, size, onChange }) => {
    const totalPages = Math.ceil(total / size)

    if (totalPages <= 1) return null

    const getPages = (): (number | '...')[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const pages: (number | '...')[] = [1]
        if (page > 3) pages.push('...')
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i)
        }
        if (page < totalPages - 2) pages.push('...')
        pages.push(totalPages)
        return pages
    }

    const btnBase = 'w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors duration-150 cursor-pointer select-none'

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-(--core-grey-5)">
            <span className="text-xs text-(--core-grey-3)">
                {total} รายการ · หน้า {page}/{totalPages}
            </span>
            <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page <= 1}
                    className={clsx(btnBase, 'bg-(--core-grey-6) text-(--core-grey-2) hover:bg-(--core-grey-5) disabled:opacity-30 disabled:cursor-not-allowed')}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {getPages().map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className={clsx(btnBase, 'text-(--core-grey-4) cursor-default')}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p as number)}
                            className={clsx(
                                btnBase,
                                p === page
                                    ? 'bg-(--core-grey-4) text-(--core-white)'
                                    : 'bg-(--core-grey-6) text-(--core-grey-2) hover:bg-(--core-grey-5)'
                            )}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page >= totalPages}
                    className={clsx(btnBase, 'bg-(--core-grey-6) text-(--core-grey-2) hover:bg-(--core-grey-5) disabled:opacity-30 disabled:cursor-not-allowed')}
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>
        </div>
    )
}

export default Pagination
