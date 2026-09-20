"use client"

import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import Empty from '@/components/Empty'
import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TopupPage: React.FC = () => {
    const { setting } = useSetting()
    const router = useRouter()

    const paymentMethods = useMemo(() => [
        {
            id: 'trueWallet',
            name: 'TrueWallet',
            description: 'โอนผ่านทรูวอลเล็ต',
            imageUrl: '/images/others/truewallet.png',
            url: '/topup/truewallet',
            hidden: !setting?.enableTruewallet && !setting?.enableDirectTruewallet
        },
        {
            id: 'bank',
            name: 'Bank',
            description: 'โอนผ่านธนาคาร',
            imageUrl: '/images/others/bank.png',
            url: '/topup/bank',
            hidden: !setting?.enableBank
        },
    ], [setting])

    const handleClickMethod = useCallback((url: string) => {
        router.push(url)
    }, [router])

    return (
        <div className='flex-1 w-full'>
            <div className='relative max-w-4xl w-full px-4 py-12 sm:py-20 lg:py-24 mx-auto z-10'>
                <span className='text-center text-(--core-white) drop-shadow-2xl flex flex-col items-center'>
                    <h1 className='font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-(image:--marketplace-gradient-gold)'>Topup</h1>
                    <h2 className='text-3xl sm:text-5xl font-bold mt-2'>เติมเงิน</h2>
                </span>
            </div>
            <div className='relative bg-(--core-off-black) w-full min-h-screen z-10 p-4 sm:p-8 lg:p-12'>
                <div className='flex flex-wrap sm:grid sm:grid-cols-3 items-center justify-between gap-4 mb-6 sm:mb-8'>
                    <div className="hidden sm:block" />
                    <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-(--core-white) text-center flex-1 sm:flex-none'>
                        เลือกช่องทางการเติมเงิน
                    </h1>
                    <div className="hidden sm:block" />
                </div>

                <div className='max-w-360 mx-auto flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8'>
                    {paymentMethods.filter((method) => !method.hidden).map((method) => (
                        <Card
                            key={method.id}
                            className='relative w-full sm:w-80 min-h-75 flex flex-col justify-center items-center'
                            onClick={() => handleClickMethod(method.url)}
                            isPressable
                        >
                            <Image
                                src={method.imageUrl}
                                alt={method.name}
                                width={200}
                                height={200}
                                className='w-36 h-36 sm:w-48 sm:h-48 object-contain object-center mx-auto'
                            />
                            <div className='flex-1 flex flex-col items-center justify-center mt-2'>
                                <h2 className='font-extrabold text-base sm:text-lg'>
                                    {method.name}
                                </h2>
                                <p className='text-center text-sm text-(--marketplace-grey-3)'>{method.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <Empty hidden={paymentMethods.some((m) => !m.hidden)} text='ปิดการเติมเงินชั่วคราว' />
            </div>

            {/* Background overlays */}
            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/60 z-0' />
            <div className='fixed top-0 left-0 w-full h-full bg-[url(/images/others/MCV_SpringDrop_DotNet_Downloadable_Wallpaper_1920x1080.png)] bg-cover bg-center -z-10' />
        </div>
    )
}

export default TopupPage