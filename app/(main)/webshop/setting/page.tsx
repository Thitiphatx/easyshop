import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import DisplaySettingPage from './components/DisplaySettingPage'

export const generateMetadata = () => generatePageMetadata('ตั้งค่าร้านค้า')

const DisplaySetting: React.FC = () => {
    return <DisplaySettingPage />
}

export default DisplaySetting