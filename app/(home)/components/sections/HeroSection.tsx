"use client"
import { getAllBanners } from '@/app/actions/banner'
import { useSetting } from '@/app/contexts/settingContext'
import { Banner } from '@/app/generated/prisma/client'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import Swal from '@/lib/Swal'
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Clipboard } from 'pixelarticons/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const HeroSection: React.FC = () => {
    const router = useRouter()
    const { serverSetting, displaySetting } = useSetting()
    const [banners, setBanners] = useState<Banner[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    const currentBanner = useMemo(() => banners[selectedIndex], [banners, selectedIndex])

    const fetchBanners = useCallback(async () => {
        const res = await getAllBanners()
        if (res.success && res.data && res.data.length > 0) {
            setBanners(res.data)
            setSelectedIndex(0)
        }
    }, [])

    const handleBannerClick = useCallback(() => {
        if (currentBanner?.link) {
            router.push(currentBanner.link)
        }
    }, [currentBanner, router])

    const handleCopyIp = useCallback(() => {
        if (!serverSetting?.serverIp) return
        navigator.clipboard.writeText(serverSetting.serverIp)
        Swal.fire({
            icon: 'success',
            text: 'คัดลอก IP เรียบร้อยแล้ว'
        })
    }, [serverSetting])

    useEffect(() => {
        fetchBanners()
    }, [fetchBanners])

    return (
        <div className="relative w-full overflow-hidden h-150">
            <div
                className={clsx("absolute inset-0 transition-all duration-700", currentBanner?.link ? "cursor-pointer" : "cursor-default")}
                onClick={handleBannerClick}
            >
                {currentBanner ? (
                    <Image
                        src={currentBanner.imageUrl}
                        alt="Banner"
                        fill
                        loading="eager"
                        sizes="(max-width: 1920px) 100vw, 33vw"
                        className="object-cover object-center h-full w-full cursor-pointer"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-(--core-grey-6)" />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Info Card */}
            <Card
                className="absolute bottom-0 left-24 z-10 flex flex-col gap-4! p-6 max-w-sm"
                cardTitle={
                    <h1 className='line-clamp-1'>
                        {displaySetting?.siteName ?? 'Server Name'}
                    </h1>
                }
                cardFooter={
                    <Button
                        color="Green"
                        variant="Solid"
                        className="text-sm! px-6!"
                        icon={<Clipboard className="w-4 h-4" />}
                        onClick={handleCopyIp}
                        iconPosition="end"
                        block
                    >
                        {serverSetting?.serverIp ?? 'SERVER IP'}
                    </Button>}
            >
                <p className='line-clamp-3'>
                    {displaySetting?.siteDesc ?? 'Welcome to our Minecraft Webshop'}
                </p>
            </Card>

            {/* Banner Selector */}
            {banners.length > 1 && (
                <div className="absolute bottom-0 right-24 flex gap-3 pb-1">
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
                                loading="eager"
                                sizes="(max-width: 1920px) 100vw, 33vw"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HeroSection
