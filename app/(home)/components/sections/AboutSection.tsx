"use client"

import React from 'react'
import Image from 'next/image'
import Button from '@/components/Button/Button'
import { useSetting } from '@/app/contexts/settingContext'

const AboutSection: React.FC = () => {
    const { isLoading, setting } = useSetting()

    return (
        <div className='flex flex-col justify-center items-center px-24 py-16'>
            <h1 className='font-bold font-pixel text-5xl text-center'>About</h1>
            <p className='text-xl'>เกี่ยวกับเซิร์ฟเวอร์</p>
            <div className='mt-12 max-w-6xl grid grid-cols-2 justify-items-center'>
                <Image src={setting?.serverImageUrl || "/images/others/1789120901925-dp6id8hy8o5.png"} alt="About" width={256} height={256} />
                <div>
                    <h1 className='text-xl font-bold'>{setting?.serverName}</h1>
                    <p className='text-xl mb-12'>
                        {setting?.serverDesc}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutSection