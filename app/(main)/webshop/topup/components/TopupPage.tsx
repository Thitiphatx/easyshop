"use client"

import React from 'react'
import PromotionSection from './sections/PromotionSection'
import SlipOkSection from './sections/SlipOkSection'
import TopupHistorySection from './sections/TopupHistorySection'
import TrueWalletSection from './sections/TrueWalletSection'

const TopupPage: React.FC = () => {
    return (
        <div className='flex flex-col gap-6'>
            <TopupHistorySection />
            <PromotionSection />
            <TrueWalletSection />
            {/* <EasySlipSection /> */}
            <SlipOkSection />
        </div>
    )
}

export default TopupPage
