import React from 'react'
import clsx from 'clsx'
import { ITableProps } from './interface'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination/Pagination'

function Table<T extends Record<string, any>>({
    columns,
    data,
    loading = false,
    emptyText = 'ไม่มีข้อมูล',
    className,
    pagination,
}: ITableProps<T>) {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }

    const skeletonRowsCount = pagination?.size || 5

    return (
        <div className={clsx('w-full', className)}>
            <div className="overflow-x-auto relative">
                {/* Overlay for refreshing / filtering when data already exists (prevents table shrinking) */}
                {loading && data.length > 0 && (
                    <div className="absolute inset-0 bg-(--core-off-black)/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity duration-200">
                        <div className="bg-(--core-grey-6)/95 border border-(--core-grey-4) px-4 py-2 shadow-lg flex items-center gap-2">
                            <Loading text="กำลังโหลด..." />
                        </div>
                    </div>
                )}

                <table className="w-full border-collapse">
                    <thead>
                        <tr style={{ background: 'var(--core-grey-6)', borderBottom: '2px solid var(--core-grey-4)' }}>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={clsx(
                                        'px-4 py-3 font-bold text-sm uppercase tracking-wider text-(--core-grey-2)',
                                        alignClass[col.align ?? 'left']
                                    )}
                                    style={{ width: typeof col.width === 'number' ? `${col.width}px` : col.width }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={clsx(loading && data.length > 0 && 'opacity-60 transition-opacity duration-200')}>
                        {/* Initial Loading: Skeleton rows matching columns to avoid height/width collapse */}
                        {loading && data.length === 0 ? (
                            Array.from({ length: skeletonRowsCount }).map((_, rowIndex) => (
                                <tr
                                    key={`skeleton-${rowIndex}`}
                                    className={clsx(
                                        'border-b border-(--core-grey-5)',
                                        rowIndex % 2 === 0 ? 'bg-(--core-grey-6)' : 'bg-(--core-off-black)'
                                    )}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={String(col.key) || colIndex}
                                            className={clsx('px-4 py-3.5', alignClass[col.align ?? 'left'])}
                                            style={{ width: typeof col.width === 'number' ? `${col.width}px` : col.width }}
                                        >
                                            <div
                                                className="h-4 bg-(--core-grey-5) rounded animate-pulse"
                                                style={{
                                                    width: col.align === 'center' ? '40%' : col.align === 'right' ? '50%' : '75%',
                                                    margin:
                                                        col.align === 'center'
                                                            ? '0 auto'
                                                            : col.align === 'right'
                                                            ? '0 0 0 auto'
                                                            : undefined,
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : !loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-(--core-grey-3)">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={clsx(
                                        'transition-colors duration-150 border-b border-(--core-grey-5)',
                                        rowIndex % 2 === 0 ? 'bg-(--core-grey-6)' : 'bg-(--core-off-black)',
                                        'hover:bg-(--core-grey-5)'
                                    )}
                                >
                                    {columns.map((col) => {
                                        const value = row[col.key as keyof T]
                                        return (
                                            <td
                                                key={String(col.key)}
                                                className={clsx(
                                                    'px-4 py-3 text-sm text-(--core-grey-2)',
                                                    alignClass[col.align ?? 'left']
                                                )}
                                                style={{ width: typeof col.width === 'number' ? `${col.width}px` : col.width }}
                                            >
                                                {col.render
                                                    ? col.render(value, row, rowIndex)
                                                    : String(value ?? '-')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <Pagination
                    page={pagination.page}
                    total={pagination.total}
                    size={pagination.size}
                    onChange={pagination.onChange}
                />
            )}
        </div>
    )
}

export default Table
