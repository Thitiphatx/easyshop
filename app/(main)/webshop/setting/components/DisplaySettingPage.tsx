"use client"

import React from 'react'
import Card from '@/components/Card/Card'
import DisplaySection from './sections/DisplaySection'
import ServerSection from './sections/ServerSection'
import BannerSection from './sections/BannerSection'

const DisplaySettingPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <Card className="p-6 md:p-8">
                <DisplaySection />
            </Card>
            <Card className="p-6 md:p-8">
                <ServerSection />
            </Card>
            <Card className="p-6 md:p-8">
                <BannerSection />
            </Card>
        </div>
    )
}

export default DisplaySettingPage