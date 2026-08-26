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

    return (
        <div className={clsx('w-full', className)}>
            <div className="overflow-x-auto">
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
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-8 py-12 text-center">
                                    <Loading size="md" />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
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
