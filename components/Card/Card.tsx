"use client"
import React from 'react'
import { ICardProps } from './interface'
import clsx from 'clsx'
import Loading from '../Loading'

const Card: React.FC<ICardProps> = ({
    cardTitle,
    cardFooter,
    isPressable = false,
    isLoading = false,
    className,
    children,
    ...props
}) => {
    const pressableClass = isPressable ? clsx("cursor-pointer hover:bg-(--core-grey-5)") : ""
    return (
        <div {...props} className={`w-full drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)] transition-colors p-3 bg-(--core-grey-6) text-(--core-white) border-l-2 border-b-2 border-l-(--core-rich-black) border-b-(--core-rich-black) border-r-2 border-r-(--core-grey-5) border-t-2 border-t-(--core-grey-5) ${clsx(className, pressableClass)}`}>
            {isLoading ? (
                <div className='h-full w-full flex justify-center items-center'>
                    <Loading />
                </div>
            ) : (
                <>
                    {cardTitle && (
                        <div className='font-pixel text-3xl mb-2'>
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
                </>
            )}
        </div>
    )
}

export default Card