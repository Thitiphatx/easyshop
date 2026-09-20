import { checkSettingExists } from '@/app/actions/setup'
import { redirect } from 'next/navigation'
import SetupPage from './components/SetupPage'

export const dynamic = 'force-dynamic'

export default async function Setup() {
    const hasSetting = await checkSettingExists()
    if (hasSetting) {
        redirect('/')
    }

    return <SetupPage />
}