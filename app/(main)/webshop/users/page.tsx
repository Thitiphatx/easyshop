import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import UserPage from './components/UserPage'

export const generateMetadata = () => generatePageMetadata('จัดการผู้ใช้')

const UserSetting: React.FC = () => {
    return <UserPage />
}

export default UserSetting