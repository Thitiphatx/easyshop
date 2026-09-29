"use client"

import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { useRouter } from 'next/navigation'
import { Close } from 'pixelarticons/react'
import React, { useCallback } from 'react'

const ClosedTopupCard: React.FC = () => {
  const router = useRouter()

  const handleClick = useCallback(() => {
    router.push("/topup")
  }, [router])

  return (
    <Card className='w-full my-6'>
      <div className='flex flex-col justify-center items-center text-center gap-4'>
        <Close className='size-48 text-(--core-grey-5)' />
        <div>
          <h3 className='text-4xl font-bold text-(--default-warning)'>ปิดระบบชั่วคราว</h3>
          <p className='text-lg text-(--core-white)'>กรุณาใช้ช่องทางอื่นในการโดเนท</p>
        </div>
        <Button color="Green" onClick={handleClick}>กลับไปหน้าช่องทางการเติมเงิน</Button>
      </div>
    </Card>
  )
}

export default ClosedTopupCard