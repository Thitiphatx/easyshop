import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import DashboardPage from './components/DashboardPage'

export const generateMetadata = () => generatePageMetadata('แดชบอร์ด')

const Overview: React.FC = () => {
    return <DashboardPage />
}

export default Overview