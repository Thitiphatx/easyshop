import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import PurchasePage from './components/PurchasePage'

export const generateMetadata = () => generatePageMetadata('ประวัติการซื้อ')

const PurchaseSetting: React.FC = () => {
    return <PurchasePage />
}

export default PurchaseSetting