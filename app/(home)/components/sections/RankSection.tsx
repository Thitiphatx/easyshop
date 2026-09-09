"use client"

import { getTopDonate } from '@/app/actions/topup'
import { ITopDonate } from '@/app/actions/topup/interface'
import { formatCurrency } from '@/app/utils/formatter'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

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
        <div className='flex flex-col justify-center items-center gap-8 py-16'>
            <Card className='w-full h-32 flex justify-center items-center'>
                <div className='flex justify-center items-center'>
                    <Image src="/images/others/emerald.webp" className='size-16 object-cover object-center -rotate-30' width={64} height={64} alt="Emerald" />
                    <div className='flex flex-col justify-center items-center h-full'>
                        <h1 className='font-bold font-pixel text-5xl text-center'>Top Donate</h1>
                        <p className='text-xl text-(--marketplace-grey-3) text-center'>จัดอันดับผู้เล่นที่เติมเงินสูงสุดในเดือนนี้</p>
                    </div>
                    <Image src="/images/others/emerald.webp" className='size-16 object-cover object-center rotate-30' width={64} height={64} alt="Emerald" />
                </div>
            </Card>
            <Card className='pb-16'>
                <div className='flex flex-row justify-center items-center gap-32'>
                    <div className='flex flex-col justify-center items-center translate-y-10'>
                        <h2 className='text-(--vanilla-green-3) font-bold text-xl'>{formatCurrency(topDonate[1].amount)}</h2>
                        <h3 className='text-(--marketplace-grey-2)'>{topDonate[1].username}</h3>
                        <img loading="eager" src={`https://mc-heads.net/body/${topDonate[1]?.username}`} alt="Player Avatar" width={128} height={300} />
                        <p className='text-xl font-bold font-pixel text-(--dungeons-orange-3)'>#2</p>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='text-(--vanilla-green-3) font-bold text-xl'>{formatCurrency(topDonate[0].amount)}</h2>
                        <h3 className='text-(--marketplace-grey-2)'>{topDonate[0].username}</h3>
                        <img loading="eager" src={`https://mc-heads.net/body/${topDonate[0]?.username}`} alt="Player Avatar" width={128} height={300} />
                        <p className='text-xl font-bold font-pixel text-(--dungeons2-red-3)'>#1</p>
                    </div>
                    <div className='flex flex-col justify-center items-center translate-y-10'>
                        <h2 className='text-(--vanilla-green-3) font-bold text-xl'>{formatCurrency(topDonate[2].amount)}</h2>
                        <h3 className='text-(--marketplace-grey-2)'>{topDonate[2].username}</h3>
                        <img loading="eager" src={`https://mc-heads.net/body/${topDonate[2]?.username}`} alt="Player Avatar" width={128} height={300} />
                        <p className='text-xl font-bold font-pixel text-(--legends-light-blue-3)'>#3</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default RankSection