import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import TrueWalletPage from './components/TrueWalletPage'

export const generateMetadata = () => generatePageMetadata('โดเนท - TrueWallet')

const TrueWallet: React.FC = () => {
    return <TrueWalletPage />
}

export default TrueWallet