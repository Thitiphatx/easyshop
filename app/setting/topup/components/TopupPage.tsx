"use client"

import React from 'react'
import TopupHistorySection from './sections/TopupHistorySection'
import PromotionSection from './sections/PromotionSection'
import MethodSection from './sections/MethodSection'

const TopupPage: React.FC = () => {
    return (
        <div className='flex-1 grid grid-cols-3 gap-4'>
            <PromotionSection />
            <MethodSection />
            <TopupHistorySection className="col-span-3" />
        </div>
    )
}

export default TopupPage
