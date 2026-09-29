import type { Metadata } from 'next'
import React from 'react'
import TopupPage from './components/TopupPage'

export const metadata: Metadata = {
    title: 'โดเนท',
    description: 'เลือกช่องทางการโดเนท',
}

const Topup: React.FC = () => {
    return <TopupPage />
}

export default Topup