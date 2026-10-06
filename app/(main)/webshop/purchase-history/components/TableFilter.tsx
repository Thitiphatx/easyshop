"use client"

import Card from '@/components/Card/Card'
import { ISelectOption, useAppForm } from '@/components/Form'
import React, { useMemo } from 'react'
import { PurchaseFilterSchema } from '../schema'
import { ITablePurchaseFilterProps } from '../interface'

const TableFilter: React.FC<ITablePurchaseFilterProps> = ({ hidden, fetchPurchase }) => {

    const form = useAppForm({
        defaultValues: {
            search: '',
            sort: '',
            order: '',
            dateFrom: '',
            dateTo: '',
        },
        onSubmit: async ({ value }) => {
            const parsed = PurchaseFilterSchema.parse({
                search: value.search?.trim() || undefined,
                sort: value.sort || undefined,
                order: value.order || undefined,
                dateFrom: value.dateFrom || undefined,
                dateTo: value.dateTo || undefined,
            })
            await fetchPurchase(parsed)
        },
    })

    const sortOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "ID", value: "id" },
        { label: "Username", value: "username" },
        { label: "เซิร์ฟเวอร์", value: "serverName" },
        { label: "ไอเท็ม", value: "itemName" },
        { label: "ราคาที่จ่าย", value: "pricePaid" },
        { label: "วันที่ซื้อ", value: "createdAt" },
    ], [])

    const orderOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "น้อยไปมาก", value: "asc" },
        { label: "มากไปน้อย", value: "desc" },
    ], [])

    return (
        <Card className='w-full' hidden={hidden}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <form.AppField
                    name="search"
                    children={(field) => <field.TextField label="ค้นหา" placeholder="ค้นหา ID, Username, เซิร์ฟเวอร์, ไอเท็ม, ราคาที่จ่าย" />}
                />
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    <form.AppField
                        name="dateFrom"
                        children={(field) => <field.DatePickerField label="วันที่เริ่มต้น" />}
                    />
                    <form.AppField
                        name="dateTo"
                        children={(field) => <field.DatePickerField label="วันที่สิ้นสุด" />}
                    />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    <form.AppField
                        name="sort"
                        children={(field) => <field.SelectField label="เรียงลำดับ" options={sortOptions} />}
                    />
                    <form.AppField
                        name="order"
                        children={(field) => <field.SelectField label="การเรียง" options={orderOptions} />}
                    />
                </div>
                <div className='flex gap-2'>
                    <form.AppForm>
                        <form.SubmitButton>Apply Filters</form.SubmitButton>
                    </form.AppForm>
                    <form.AppForm>
                        <form.ResetButton
                            onClick={() => {
                                form.reset()
                                fetchPurchase({})
                            }}
                            variant='Outline'
                            color="Default"
                        >
                            Reset
                        </form.ResetButton>
                    </form.AppForm>
                </div>
            </form>
        </Card>
    )
}

export default TableFilter