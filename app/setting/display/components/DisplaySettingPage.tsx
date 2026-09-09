"use client"

import Card from '@/components/Card/Card'
import React from 'react'
import DisplaySection from './sections/DisplaySection'
import BannerSection from './sections/BannerSection'
import ServerSection from './sections/ServerSection'

const DisplaySettingPage: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <DisplaySection />
            <ServerSection />
            <BannerSection />
        </div>
    )
}

export default DisplaySettingPage