"use client"

import React from 'react'
import Image from 'next/image'
import Button from '@/components/Button/Button'
import { useSetting } from '@/app/contexts/settingContext'

const AboutSection: React.FC = () => {
    const { isLoading, setting } = useSetting()

    return (
        <div className='w-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-24 py-12 sm:py-16'>
            <h1 className='font-bold font-pixel text-4xl sm:text-5xl text-center'>About</h1>
            <p className='text-lg sm:text-xl text-(--marketplace-grey-3)'>เกี่ยวกับเซิร์ฟเวอร์</p>
            <div className='mt-8 sm:mt-12 max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center'>
                <Image
                    src={setting?.serverImageUrl || "/images/others/1789120901925-dp6id8hy8o5.png"}
                    alt="About"
                    width={256}
                    height={256}
                    className="w-44 sm:w-64 h-auto object-contain"
                />
                <div className='text-center md:text-left'>
                    <h1 className='text-2xl sm:text-3xl font-bold font-pixel text-(--core-green-3) mb-2'>{setting?.serverName}</h1>
                    <p className='text-base sm:text-lg text-(--core-grey-2) leading-relaxed'>
                        {setting?.serverDesc}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutSection