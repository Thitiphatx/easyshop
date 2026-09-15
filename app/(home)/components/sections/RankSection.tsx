"use client"

import { getTopDonate } from '@/app/actions/topup'
import { ITopDonate } from '@/app/actions/topup/interface'
import { formatCurrency } from '@/app/utils/formatter'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Hash } from 'pixelarticons/react'

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
                text: `[Ranking] ${res.error}`
            })
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchTopDonate()
    }, [fetchTopDonate])


    if (isLoading || topDonate.length < 3) return <Loading />

    return (
        <div className='flex flex-col justify-center items-center gap-4 py-8 sm:py-16 w-full'>
            <Card className='w-full h-auto py-6 sm:h-32 flex justify-center items-center border-b-0! border-l-0! border-r-0!'>
                <div className='flex justify-center items-center gap-2 sm:gap-4 px-4'>
                    <Image src="/images/others/emerald.webp" className='size-8 sm:size-16 object-cover object-center -rotate-30 shrink-0' width={64} height={64} alt="Emerald" />
                    <div className='flex flex-col justify-center items-center text-center'>
                        <h1 className='font-bold font-pixel text-3xl sm:text-5xl text-center'>Top Donate</h1>
                        <p className='text-sm sm:text-xl text-(--marketplace-grey-3) text-center'>จัดอันดับผู้เล่นที่เติมเงินสูงสุดในเดือนนี้</p>
                    </div>
                    <Image src="/images/others/emerald.webp" className='size-8 sm:size-16 object-cover object-center rotate-30 shrink-0' width={64} height={64} alt="Emerald" />
                </div>
            </Card>
            <Card className='w-full py-8 sm:pb-16 border-t-0! border-l-0! border-r-0! overflow-hidden'>
                <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-24 max-w-7xl mx-auto px-4'>
                    {/* Rank 2 */}
                    <div className='order-2 md:order-1 flex flex-col justify-center items-center md:translate-y-10'>
                        <h2 className='text-(--vanilla-green-3) font-bold text-lg sm:text-xl'>{formatCurrency(topDonate[1].amount)}</h2>
                        <h3 className='text-(--marketplace-grey-2) text-base sm:text-xl'>{topDonate[1].username}</h3>
                        <img loading="eager" src={`https://mc-heads.net/body/${topDonate[1]?.username}`} alt="Player Avatar" className="w-24 sm:w-32 h-auto" width={128} height={300} />
                        <span className='flex items-center font-bold font-pixel text-(--dungeons-orange-3) mt-2'>
                            <Hash className='stroke-current size-5 sm:size-7' strokeWidth={2} />
                            <p className='text-3xl sm:text-4xl'>2</p>
                        </span>
                    </div>

                    {/* Rank 1 */}
                    <div className='order-1 md:order-2 flex flex-col justify-center items-center'>
                        <h2 className='text-(--vanilla-green-3) font-bold text-xl sm:text-2xl'>{formatCurrency(topDonate[0].amount)}</h2>
                        <h3 className='text-(--marketplace-grey-2) text-lg sm:text-xl font-bold'>{topDonate[0].username}</h3>
                        <img loading="eager" src={`https://mc-heads.net/body/${topDonate[0]?.username}`} alt="Player Avatar" className="w-28 sm:w-36 h-auto" width={128} height={300} />
                        <span className='flex items-center font-bold font-pixel text-(--dungeons2-red-3) mt-1'>
                            <Hash className='stroke-current size-6 sm:size-7' strokeWidth={2} />
                            <p className='text-3xl sm:text-4xl'>1</p>
                        </span>
                    </div>

                    {/* Rank 3 */}
                    <div className='order-3 md:order-3 flex flex-col justify-center items-center md:translate-y-10'>
                        <h2 className='text-(--vanilla-green-3) font-bold text-lg sm:text-xl'>{formatCurrency(topDonate[2].amount)}</h2>
                        <h3 className='text-(--marketplace-grey-2) text-base sm:text-xl'>{topDonate[2].username}</h3>
                        <img loading="eager" src={`https://mc-heads.net/body/${topDonate[2]?.username}`} alt="Player Avatar" className="w-24 sm:w-32 h-auto" width={128} height={300} />
                        <span className='flex items-center font-bold font-pixel text-(--legends-light-blue-3) mt-2'>
                            <Hash className='stroke-current size-5 sm:size-7' strokeWidth={2} />
                            <p className='text-3xl sm:text-4xl'>3</p>
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default RankSection