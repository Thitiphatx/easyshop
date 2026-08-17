"use client"
import React from 'react'
import { ICardProps } from './interface'
import clsx from 'clsx'

const Card: React.FC<ICardProps> = ({
    cardTitle,
    cardFooter,
    isPressable = false,
    className,
    children,
    ...props
}) => {
    const pressableClass = isPressable ? clsx("cursor-pointer hover:bg-(--core-grey-5)") : ""
    return (
        <div {...props} className={`w-full drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)] transition-colors p-4 bg-(--core-grey-6) text-(--core-white) border-l-4 border-b-4 border-l-(--core-rich-black) border-b-(--core-rich-black) border-r-4 border-r-(--core-grey-5) border-t-4 border-t-(--core-grey-5) ${clsx(className, pressableClass)}`}>
            {cardTitle && (
                <div className='font-pixel font-bold text-3xl mb-4'>
                    {cardTitle}
                </div>
            )}
            <div className='text-(--core-grey-2)'>
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