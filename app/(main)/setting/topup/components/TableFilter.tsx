"use client"

import Card from '@/components/Card/Card'
import { ISelectOption, useAppForm } from '@/components/Form'
import React, { useMemo } from 'react'
import { TopupFilterSchema } from '../schema'
import { ITableTopupFilterProps } from '../interface'

const TableFilter: React.FC<ITableTopupFilterProps> = ({ hidden, fetchTopups }) => {

    const form = useAppForm({
        defaultValues: {
            search: '',
            status: '',
            sort: '',
            order: '',
        },
        onSubmit: async ({ value }) => {
            const parsed = TopupFilterSchema.parse({
                search: value.search?.trim() || undefined,
                status: value.status || undefined,
                sort: value.sort || undefined,
                order: value.order || undefined,
            })
            await fetchTopups(parsed)
        },
    })

    const statusOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "สำเร็จ", value: "SUCCESS" },
        { label: "รอดำเนินการ", value: "PENDING" },
        { label: "ล้มเหลว", value: "FAILED" },
    ], [])

    const sortOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "ID", value: "id" },
        { label: "Username", value: "username" },
        { label: "ช่องทาง", value: "channel" },
        { label: "จำนวนเงิน", value: "amount" },
        { label: "พอยท์ที่ได้", value: "pointsAdded" },
        { label: "สถานะ", value: "status" },
        { label: "วันที่เติม", value: "createdAt" },
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
                    children={(field) => <field.TextField label="ค้นหา" placeholder="ค้นหา ID, Username, ช่องทาง, จำนวนเงิน, พอยท์, อ้างอิง" />}
                />
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
                    <form.AppField
                        name="status"
                        children={(field) => <field.SelectField label="สถานะ" options={statusOptions} />}
                    />
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
                                fetchTopups({})
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
