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
import { ChevronLeft, ChevronRight, Clipboard } from 'pixelarticons/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const HeroSection: React.FC = () => {
    const router = useRouter()
    const { isLoading, setting } = useSetting()
    const [banners, setBanners] = useState<Banner[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [copied, setCopied] = useState(false)

    const fetchBanners = useCallback(async () => {
        const res = await getAllBanners()
        if (res.success && res.data && res.data.length > 0) {
            setBanners(res.data)
            setSelectedIndex(0)
        }
    }, [])

    const handlePrev = useCallback(() => {
        if (banners.length <= 1) return
        setSelectedIndex((prev) => (prev - 1 + banners.length) % banners.length)
    }, [banners.length])

    const handleNext = useCallback(() => {
        if (banners.length <= 1) return
        setSelectedIndex((prev) => (prev + 1) % banners.length)
    }, [banners.length])

    const handleBannerClick = useCallback((link?: string | null) => {
        if (link) {
            router.push(link)
        }
    }, [router])

    const handleCopyIp = useCallback(() => {
        const ip = setting?.serverIp || 'play.easyshop.net'
        navigator.clipboard.writeText(ip)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)

        Swal.fire({
            icon: 'success',
            text: 'คัดลอก IP เรียบร้อยแล้ว'
        })
    }, [setting?.serverIp])

    // Auto slide timer
    useEffect(() => {
        if (banners.length <= 1 || isHovered) return
        const interval = setInterval(() => {
            setSelectedIndex((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [banners.length, isHovered])

    useEffect(() => {
        fetchBanners()
    }, [fetchBanners])

    return (
        <div
            className="group/hero relative w-full overflow-hidden h-[450px] sm:h-[500px] lg:h-150 select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Carousel Sliding Track */}
            {banners.length > 0 ? (
                <div
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={clsx(
                                "relative w-full h-full shrink-0 overflow-hidden",
                                banner.link ? "cursor-pointer" : "cursor-default"
                            )}
                            onClick={() => handleBannerClick(banner.link)}
                        >
                            <Image
                                src={banner.imageUrl}
                                alt={`Banner ${index + 1}`}
                                fill
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                sizes="100vw"
                                className="object-cover object-center h-full w-full transition-transform hover:scale-101"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-full bg-(--core-grey-6)" />
            )}

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePrev()
                        }}
                        aria-label="Previous Slide"
                        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all opacity-80 sm:opacity-0 group-hover/hero:opacity-100 hover:scale-110 cursor-pointer shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNext()
                        }}
                        aria-label="Next Slide"
                        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all opacity-80 sm:opacity-0 group-hover/hero:opacity-100 hover:scale-110 cursor-pointer shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </>
            )}

            {/* Info Card */}
            <Card
                className="absolute bottom-3 sm:bottom-0 left-3 sm:left-8 lg:left-24 right-3 sm:right-auto z-10 flex flex-col gap-3 sm:gap-4! p-4 sm:p-6 max-w-full sm:max-w-sm h-auto sm:h-52"
                cardTitle={
                    <h1 className="line-clamp-1 text-xl sm:text-2xl">
                        {setting?.siteName ?? 'Easyshop'}
                    </h1>
                }
                cardFooter={
                    <Button
                        color="Green"
                        variant="Solid"
                        className="text-xs sm:text-sm! px-4 sm:px-6!"
                        icon={<Clipboard className="w-4 h-4" />}
                        onClick={handleCopyIp}
                        iconPosition="end"
                        block
                    >
                        {copied ? 'COPIED TO CLIPBOARD!' : (setting?.serverIp || 'play.easyshop.net')}
                    </Button>
                }
                isLoading={isLoading}
            >
                <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm">
                    {setting?.siteDesc ?? 'Welcome to our Minecraft Webshop'}
                </p>
            </Card>

            {/* Banner Selector Thumbnails (Desktop) */}
            {banners.length > 1 && (
                <div className="hidden lg:flex absolute bottom-0 right-24 z-10 items-center gap-3 pb-1">
                    {banners.map((banner, index) => (
                        <button
                            key={banner.id}
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedIndex(index)
                            }}
                            className="relative overflow-hidden transition-all duration-300 cursor-pointer rounded-xs"
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
                                sizes="120px"
                                className="object-cover hover:scale-105 transition"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Mobile Indicators (Dots) */}
            {banners.length > 1 && (
                <div className="lg:hidden absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1.5 border border-white/20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedIndex(index)
                            }}
                            className={`size-2 transition-all cursor-pointer ${
                                index === selectedIndex
                                    ? 'bg-(--core-green-3) scale-125'
                                    : 'bg-white/40 hover:bg-white/70'
                            }`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default HeroSection
