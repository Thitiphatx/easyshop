"use client"

import React from 'react'
import TopupHistorySection from './sections/TopupHistorySection'
import PromotionSection from './sections/PromotionSection'
import TrueWalletSection from './sections/TrueWalletSection'
import EasySlipSection from './sections/EasySlipSection'

const TopupPage: React.FC = () => {
    return (
        <div className='flex flex-col gap-6'>
            <TopupHistorySection />
            <PromotionSection />
            <TrueWalletSection />
            <EasySlipSection />
        </div>
    )
}

export default TopupPage
