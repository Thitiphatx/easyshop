"use client"

import { formatCurrency } from '@/app/utils/formatter'
import { Hash, Crown } from 'pixelarticons/react'
import React from 'react'
import { IRankingCardProps } from '../interface'
import clsx from 'clsx'
import Image from 'next/image'

const RANK_CONFIG: Record<number, {
    border: string
    glow: string
    badge: string
    rankText: string
    crownColor: string | null
}> = {
    1: {
        border: 'border-(--dungeons-orange-3)',
        glow: 'shadow-[0_0_24px_4px_rgba(255,196,43,0.25)]',
        badge: 'bg-(--dungeons-orange-3) text-(--core-rich-black)',
        rankText: 'text-(--dungeons-orange-3)',
        crownColor: 'text-(--dungeons-orange-3)',
    },
    2: {
        border: 'border-(--marketplace-grey-2)',
        glow: 'shadow-[0_0_20px_2px_rgba(208,197,192,0.18)]',
        badge: 'bg-(--marketplace-grey-2) text-(--core-rich-black)',
        rankText: 'text-(--marketplace-grey-2)',
        crownColor: 'text-(--marketplace-grey-2)',
    },
    3: {
        border: 'border-(--vanilla-brown-3)',
        glow: 'shadow-[0_0_18px_2px_rgba(151,103,70,0.22)]',
        badge: 'bg-(--vanilla-brown-3) text-(--core-white)',
        rankText: 'text-(--vanilla-brown-3)',
        crownColor: 'text-(--vanilla-brown-3)',
    },
}

const getRankConfig = (rank: number) =>
    RANK_CONFIG[rank] ?? {
        border: 'border-(--marketplace-grey-5)',
        glow: '',
        badge: 'bg-(--marketplace-grey-5) text-(--marketplace-grey-2)',
        rankText: 'text-(--marketplace-grey-2)',
        crownColor: null,
    }

const RankingCard: React.FC<IRankingCardProps> = ({
    topDonateInfo,
    direction = 'right'
}) => {
    const cfg = getRankConfig(topDonateInfo.rank)

    return (
        <div className={clsx(
            'group relative flex flex-col items-center gap-1 p-4 rounded-sm',
            'bg-(--core-grey-6)/80 backdrop-blur-sm',
            'border-2 transition-all duration-300',
            cfg.border,
            cfg.glow,
        )}>

            <span className={clsx(
                'absolute -top-3 left-1/2 -translate-x-1/2',
                'flex items-center gap-0.5 px-2 py-0.5 rounded-sm',
                'font-pixel text-xs font-bold',
                cfg.badge,
            )}>
                {cfg.crownColor ? (
                    <Crown className='size-4 stroke-current fill-current' strokeWidth={1} />
                ) : (
                    <>
                        <Hash className='size-3 stroke-current' strokeWidth={2} />
                        {topDonateInfo.rank}
                    </>
                )}
            </span>

            <div className='relative mt-1'>
                <Image
                    unoptimized
                    loading='eager'
                    src={`https://mc-heads.net/body/${topDonateInfo.username}${direction === "left" ? "/left" : ""}`}
                    alt={`${topDonateInfo.username} avatar`}
                    className='w-20 sm:w-24 h-auto'
                    width={96}
                    height={200}
                />
            </div>

            <h3 className={clsx(
                'font-bold text-sm sm:text-base text-center leading-tight truncate max-w-full px-1',
                cfg.rankText,
            )}>
                {topDonateInfo.username}
            </h3>

            <p className='text-(--vanilla-green-3) text-base sm:text-lg font-pixel'>
                {formatCurrency(topDonateInfo.amount)}
            </p>
        </div>
    )
}

export default RankingCard