"use client"

import { getTopDonate } from '@/app/actions/topup'
import { ITopDonate } from '@/app/actions/topup/interface'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useState } from 'react'
import RankingCard from './RankingCard'
import Loading from '@/components/Loading'
import Card from '@/components/Card/Card'
import Image from 'next/image'
import Empty from '@/components/Empty'


const RankGrid = ({ data, direction }: { data: ITopDonate[]; direction: 'left' | 'right' }) => (
    <div className='px-4 sm:px-8 lg:px-12 pt-8 pb-10'>
        {data.length === 0 ? (
            <Empty />
        ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 w-full pt-4'>
                {data.map((rank) => (
                    <RankingCard key={rank.rank} topDonateInfo={rank} direction={direction} />
                ))}
            </div>
        )}
    </div>
)

const RankingPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [allTopDonate, setAllTopDonate] = useState<ITopDonate[]>([])
    const [monthlyTopDonate, setMonthlyTopDonate] = useState<ITopDonate[]>([])

    const fetchTopDonate = useCallback(async (type: 'month' | 'all') => {
        setIsLoading(true)
        const res = await getTopDonate({ top: 10, type })
        if (res.success && res.data) {
            if (type === 'all') {
                setAllTopDonate(res.data)
            } else if (type === 'month') {
                setMonthlyTopDonate(res.data)
            }
        } else {
            Swal.fire({
                icon: 'error',
                text: `[Ranking] ${res.error}`
            })
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchTopDonate('month')
        fetchTopDonate('all')
    }, [fetchTopDonate])

    return (
        <div className='flex-1 w-full'>
            {/* Hero */}
            <div className='relative w-full mx-auto z-10 flex flex-col justify-center'>
                <span className='text-center text-(--core-white) drop-shadow-lg flex flex-col justify-center items-center py-32'>
                    <h1 className='font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold'>Ranking</h1>
                    <h2 className='text-3xl sm:text-5xl font-bold mt-2'>จัดอันดับเติมเงิน</h2>
                </span>

                {/* Content panels */}
                <div className='w-full bg-(--core-off-black) pb-24 flex flex-col gap-0'>
                    {isLoading ? (
                        <div className='flex justify-center items-center py-32'>
                            <Loading />
                        </div>
                    ) : (
                        <>
                            {/* Monthly */}
                            <section className='w-full border-b-2 border-b-(--marketplace-grey-5)'>
                                <Card cardTitle={
                                    <div className='flex items-center gap-2'>
                                        <Image src={'/images/others/emerald.webp'} width={32} height={32} alt='Emerald' />
                                        Monthly
                                    </div>
                                }>
                                    อันดับผู้เล่นที่โดเนทสูงสุดประจำเดือนนี้
                                </Card>
                                <RankGrid data={monthlyTopDonate} direction='left' />
                            </section>

                            {/* All time */}
                            <section className='w-full'>
                                <Card cardTitle={
                                    <div className='flex items-center gap-2'>
                                        <Image src={'/images/others/emerald.webp'} width={32} height={32} alt='Emerald' />
                                        All Time
                                    </div>
                                }>
                                    อันดับผู้เล่นที่โดเนทสูงสุดตลอดกาล
                                </Card>
                                <RankGrid data={allTopDonate} direction='right' />
                            </section>
                        </>
                    )}
                </div>
            </div>

            {/* Background overlays */}
            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/40 z-0' />
            <div className='fixed top-0 left-0 w-full h-full bg-[url(/images/others/wallpaper_minecraft_caves_cliffs_part2_1920x1080.png)] bg-cover bg-center -z-10' />
        </div>
    )
}

export default RankingPage