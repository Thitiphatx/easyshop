import type { Metadata } from 'next'
import { checkSettingExists } from '@/app/actions/setup'
import { redirect } from 'next/navigation'
import SetupPage from './components/SetupPage'

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export const metadata: Metadata = {
    title: 'ตั้งค่าเริ่มต้น',
    description: 'ตั้งค่าระบบเริ่มต้นสำหรับร้านค้า EasyShop',
}

export default async function Setup() {
    const hasSetting = await checkSettingExists()
    if (hasSetting) {
        redirect('/')
    }

    return <SetupPage />
}