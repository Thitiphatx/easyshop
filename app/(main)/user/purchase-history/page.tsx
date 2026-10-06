import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import PurchaseHistory from './components/PurchaseHistory'

export const generateMetadata = () => generatePageMetadata('ประวัติการซื้อ')

const PurchaseHistoryPage: React.FC = () => {
    return (
        <PurchaseHistory />
    )
}

export default PurchaseHistoryPage