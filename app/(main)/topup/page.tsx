import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import TopupPage from './components/TopupPage'

export const generateMetadata = () => generatePageMetadata('โดเนท')

const Topup: React.FC = () => {
    return <TopupPage />
}

export default Topup