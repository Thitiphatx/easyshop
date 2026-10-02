import { generatePageMetadata } from '@/lib/metadata'
import React from 'react'
import Profile from './components/Profile'

export const generateMetadata = () => generatePageMetadata('โปรไฟล์')

const ProfilePage: React.FC = () => {
    return (
        <Profile />
    )
}

export default ProfilePage