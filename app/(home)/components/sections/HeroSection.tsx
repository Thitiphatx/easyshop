"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSetting } from '@/app/contexts/settingContext'
import { getAllBanners } from '@/app/actions/banner'
import { Banner } from '@/app/generated/prisma/client'
import Button from '@/components/Button/Button'
import { ChevronRight } from 'pixelarticons/react'

const HeroSection: React.FC = () => {
    const router = useRouter()
    const { serverSetting } = useSetting()
    const [banners, setBanners] = useState<Banner[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    const fetchBanners = useCallback(async () => {
        const res = await getAllBanners()
        if (res.success && res.data && res.data.length > 0) {
            setBanners(res.data)
            setSelectedIndex(0)
        }
    }, [])

    useEffect(() => {
        fetchBanners()
    }, [fetchBanners])

    const currentBanner = banners[selectedIndex]

    const handleBannerClick = () => {
        if (currentBanner?.link) {
            router.push(currentBanner.link)
        }
    }

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ minHeight: '640px' }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 transition-all duration-700"
                onClick={handleBannerClick}
                style={{ cursor: currentBanner?.link ? 'pointer' : 'default' }}
            >
                {currentBanner ? (
                    <Image
                        src={currentBanner.imageUrl}
                        alt="Banner"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-(--core-grey-6)" />
                )}
                {/* Dark overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full px-10 pb-10 pt-32">
                <div className="flex items-end justify-between gap-6">

                    {/* Info Card */}
                    <div
                        className="flex flex-col gap-3 p-6 max-w-sm"
                        style={{
                            background: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(4px)',
                            borderLeft: '4px solid var(--core-green-3)',
                        }}
                    >
                        <div>
                            <h1 className="text-2xl font-bold text-(--core-white) leading-tight">
                                {serverSetting?.serverName ?? 'Server Name'}
                            </h1>
                            <p className="text-(--core-grey-2) text-sm mt-1">
                                Welcome to our Minecraft server
                            </p>
                        </div>
                        <Button
                            color="Green"
                            variant="Solid"
                            className="text-sm! px-6!"
                            icon={<ChevronRight className="w-4 h-4" />}
                            iconPosition="end"
                        >
                            {serverSetting?.serverIp ?? 'SERVER IP'}
                        </Button>
                    </div>

                    {/* Banner Selector */}
                    {banners.length > 1 && (
                        <div className="flex gap-3 pb-1">
                            {banners.map((banner, index) => (
                                <button
                                    key={banner.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedIndex(index)
                                    }}
                                    className="relative overflow-hidden transition-all duration-200 cursor-pointer"
                                    style={{
                                        width: '112px',
                                        height: '72px',
                                        outline: index === selectedIndex
                                            ? '3px solid var(--core-green-3)'
                                            : '2px solid rgba(255,255,255,0.2)',
                                        opacity: index === selectedIndex ? 1 : 0.6,
                                        transform: index === selectedIndex ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                >
                                    <Image
                                        src={banner.imageUrl}
                                        alt={`Banner ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeroSection
