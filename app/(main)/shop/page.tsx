import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import ServerSection from './components/ServerSection'

export const generateMetadata = () => generatePageMetadata('ร้านค้า')

const Manage: React.FC = async () => {
  return <ServerSection />
}

export default Manage