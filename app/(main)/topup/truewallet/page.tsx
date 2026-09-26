import type { Metadata } from 'next'
import React from 'react'
import TrueWalletPage from './components/TrueWalletPage'

export const metadata: Metadata = {
    title: 'โดเนท - TrueWallet',
    description: 'โดเนทผ่านซองของขวัญ TrueWallet',
}

const TrueWallet: React.FC = () => {
    return <TrueWalletPage />
}

export default TrueWallet