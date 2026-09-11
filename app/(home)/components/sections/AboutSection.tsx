"use client"

import React from 'react'
import Image from 'next/image'
import Button from '@/components/Button/Button'

const AboutSection: React.FC = () => {
    return (
        <div className='flex flex-col justify-center items-center px-24 py-16'>
            <h1 className='font-bold font-pixel text-5xl text-center'>About</h1>
            <p className='text-xl'>เกี่ยวกับเซิร์ฟเวอร์</p>
            <div className='mt-12 max-w-6xl grid grid-cols-2 justify-items-center'>
                <Image src="/images/others/1789120901925-dp6id8hy8o5.png" alt="About" width={256} height={256} />
                <div>
                    <p className='text-xl mb-12'>
                        "เข้าร่วม Discord ของพวกเรา" นี่คือแอปการสื่อสารที่มีคุณสมบัติเต็มรูปแบบที่รันบนระบบต่างๆ มากมาย เกมเมอร์หลายล้านคนใช้ Discord ทุกๆ วันเพื่อเชื่อมต่อ แชร์เนื้อหา และเล่นเกมด้วยกัน เข้ามาสร้าง Community ที่แข็งแกร่งด้วยกันได้แล้ววันนี้
                    </p>
                    <Button variant='Retro'>Go..</Button>
                </div>
            </div>
        </div>
    )
}

export default AboutSection