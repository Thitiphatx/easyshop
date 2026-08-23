import React from 'react'
import { IEmptyProps } from './interface'
import { AnnoyedSharp } from 'pixelarticons/react'

const Empty: React.FC<IEmptyProps> = ({
    text = "ยังไม่มีข้อมูล",
    ...props
}) => {
    return (
        <div {...props} className='flex flex-col justify-center items-center w-full h-full p-10'>
            <AnnoyedSharp fontVariant="Sharp" width={128} height={128} className='text-(--marketplace-grey-5)' />
            <p className='font-bold text-7xl line-clamp-1 text-(--marketplace-grey-5)'>{text}</p>
        </div>
    )
}

export default Empty