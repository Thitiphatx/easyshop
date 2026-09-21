"use client"

import React, { useEffect } from 'react'
import TopupHistorySection from './sections/TopupHistorySection'
import PromotionSection from './sections/PromotionSection'
import TrueWalletSection from './sections/TrueWalletSection'
import { useAuth } from '@/app/contexts/authContext'
import Swal from '@/lib/Swal'
import { useRouter } from 'next/navigation'
import EasySlipSection from './sections/EasySlipSection'

const TopupPage: React.FC = () => {
    const { session, isLoading, openAuth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !session) {
            Swal.fire({
                icon: 'info',
                title: 'กรุณาเข้าสู้ระบบก่อน',
            }).then(() => {
                openAuth()
                router.push('/')
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <PromotionSection />
            <TrueWalletSection />
            <EasySlipSection />
            <TopupHistorySection className="col-span-1 lg:col-span-3" />
        </div>
    )
}

export default TopupPage
