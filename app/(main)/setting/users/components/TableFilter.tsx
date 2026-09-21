"use client"

import Card from '@/components/Card/Card'
import { ISelectOption, useAppForm } from '@/components/Form'
import React, { useMemo } from 'react'
import { ITableUserFilterProps } from '../interface'
import { UserFilterFormValues, UserFilterSchema } from '../schema'

const TableFilter: React.FC<ITableUserFilterProps> = ({ hidden, fetchUser }) => {

    const form = useAppForm({
        defaultValues: {
            search: '',
            isLogged: '',
            isAdmin: '',
            sort: '',
            order: '',
        },
        onSubmit: async ({ value }) => {
            const parsed = UserFilterSchema.parse({
                search: value.search?.trim() || undefined,
                isLogged: value.isLogged === 'true' ? true : value.isLogged === 'false' ? false : undefined,
                isAdmin: value.isAdmin === 'true' ? true : value.isAdmin === 'false' ? false : undefined,
                sort: value.sort || undefined,
                order: value.order || undefined,
            })
            await fetchUser(parsed)
        },
    })

    const sortOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "ID", value: "id" },
        { label: "Username", value: "username" },
        { label: "เข้าเกมล่าสุด", value: "lastlogin" },
        { label: "Email", value: "email" },
        { label: "Points", value: "points" },
    ], [])

    const orderOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "น้อยไปมาก", value: "asc" },
        { label: "มากไปน้อย", value: "desc" },
    ], [])

    const isLoggedOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "ออนไลน์", value: "true" },
        { label: "ออฟไลน์", value: "false" },
    ], [])

    const isAdminOptions: ISelectOption[] = useMemo(() => [
        { label: "ไม่ได้เลือก", value: "" },
        { label: "แอดมิน", value: "true" },
        { label: "ผู้เล่น", value: "false" },
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
                    children={(field) => <field.TextField label="ค้นหา" placeholder="ค้นหา ID, Username, Email, IP" />}
                />
                <div className='grid grid-cols-4 gap-2'>
                    <form.AppField
                        name="isLogged"
                        children={(field) => <field.SelectField label="อยู่ในเกม" options={isLoggedOptions} />}
                    />
                    <form.AppField
                        name="isAdmin"
                        children={(field) => <field.SelectField label="ตำแหน่ง" options={isAdminOptions} />}
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
                                fetchUser({})
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