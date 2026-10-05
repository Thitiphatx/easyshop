"use client"

import { getTopDonate } from '@/app/actions/topup'
import { ITopDonate } from '@/app/actions/topup/interface'
import RankingCard from '@/app/(main)/ranking/components/RankingCard'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

const RankSection: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [topDonate, setTopDonate] = useState<ITopDonate[]>([])

    const fetchTopDonate = useCallback(async () => {
        setIsLoading(true)
        const res = await getTopDonate({ top: 3, type: 'month' })
        if (res.success && res.data) {
            setTopDonate(res.data)
        } else {
            Swal.fire({
                icon: 'error',
                text: res.error
            })
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchTopDonate()
    }, [fetchTopDonate])


    return (
        isLoading ? <Loading /> : topDonate.length > 0 ?
            <div className='flex flex-col justify-center items-center gap-4 py-8 sm:py-16 w-full'>
                <Card className='w-full h-auto py-6 sm:h-32 flex justify-center items-center border-b-0! border-l-0! border-r-0!'>
                    <div className='flex justify-center items-center gap-2 sm:gap-4 px-4'>
                        <Image src="/images/others/emerald.webp" className='size-8 sm:size-16 object-cover object-center -rotate-30 shrink-0' width={64} height={64} alt="Emerald" />
                        <div className='flex flex-col justify-center items-center text-center'>
                            <h1 className='font-bold font-pixel text-3xl sm:text-5xl text-center'>Top Donate</h1>
                            <p className='text-sm sm:text-xl text-(--marketplace-grey-3) text-center'>จัดอันดับผู้เล่นที่โดเนทสูงสุดในเดือนนี้</p>
                        </div>
                        <Image src="/images/others/emerald.webp" className='size-8 sm:size-16 object-cover object-center rotate-30 shrink-0' width={64} height={64} alt="Emerald" />
                    </div>
                </Card>
                <Card className='w-full py-8 sm:pb-16 border-t-0! border-l-0! border-r-0! overflow-hidden'>
                    <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-24 max-w-7xl mx-auto px-4'>
                        {topDonate.map((rank) => (
                            <RankingCard key={rank.rank} topDonateInfo={rank} />
                        ))}
                    </div>
                </Card>
            </div>
            : <></>
    )
}

export default RankSection