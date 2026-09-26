import type { Metadata } from 'next'
import React from 'react'
import BankPage from './components/BankPage'

export const metadata: Metadata = {
    title: 'โดเนท - ธนาคาร',
    description: 'โดเนทผ่านการโอนธนาคารและอัปโหลดสลิป',
}

const Bank: React.FC = () => {
    return <BankPage />
}

export default Bank