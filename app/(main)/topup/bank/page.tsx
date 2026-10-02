import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import BankPage from './components/BankPage'

export const generateMetadata = () => generatePageMetadata('โดเนท - ธนาคาร')

const Bank: React.FC = () => {
    return <BankPage />
}

export default Bank