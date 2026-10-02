import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import TopupHistory from './components/TopupHistory'

export const generateMetadata = () => generatePageMetadata('ประวัติการโดเนท')

const TopupHistoryPage: React.FC = () => {
    return (
        <TopupHistory />
    )
}

export default TopupHistoryPage
