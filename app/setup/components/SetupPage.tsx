"use client"

import { getSetting } from '@/app/actions/setting'
import { Setting } from '@/app/generated/prisma/client'
import Card from '@/components/Card/Card'
import { redirect } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'

const SetupPage: React.FC = () => {
    const [settings, setSettings] = React.useState<Setting | null>(null)

    const fetchSetting = useCallback(async () => {
        const res = await getSetting()
        if (res.success && res.data) {
            redirect("/")
        }
    }, [])

    useEffect(() => {
        // fetchSetting()
    }, [fetchSetting])

    return (
        <div className='flex-1'>
            <Card cardTitle={"asdasd"}>

            </Card>
        </div>
    )
}

export default SetupPage