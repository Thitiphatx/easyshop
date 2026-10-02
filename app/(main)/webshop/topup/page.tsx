import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import TopupPage from './components/TopupPage'

export const generateMetadata = () => generatePageMetadata('ประวัติการโดเนท')

const TopupSetting: React.FC = () => {
    return <TopupPage />
}

export default TopupSetting