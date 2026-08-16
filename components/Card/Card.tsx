"use client"
import React from 'react'
import { ICardProps } from './interface'
import clsx from 'clsx'

const Card: React.FC<ICardProps> = ({
    cardTitle,
    cardFooter,
    className,
    children,
    ...props
}) => {
    return (
        <div {...props} className={`w-full drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)] p-2 bg-(--mc-core-off-black) text-(--mc-core-white) border-l-4 border-b-4 border-l-(--mc-core-rich-black) border-b-(--mc-core-rich-black) border-r-4 border-r-(--mc-vanilla-grey-6) border-t-4 border-t-(--mc-vanilla-grey-6) ${clsx(className)}`}>
            {cardTitle && (
                <div className='font-pixel font-bold text-3xl my-4'>
                    {cardTitle}
                </div>
            )}
            <div className='text-(--mc-core-grey-2)'>
                {children}
            </div>

            {cardFooter && (
                <div>
                    {cardFooter}
                </div>
            )}
        </div>
    )
}

export default Card