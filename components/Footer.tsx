"use client"
import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Clipboard, Check } from 'pixelarticons/react'
import { useSetting } from '@/app/contexts/settingContext'
import Button from '@/components/Button/Button'
import Swal from '@/lib/Swal'

import { NAV_ITEMS } from '@/constants/navigation'

const Footer: React.FC = () => {
    const router = useRouter()
    const { setting, mcStatus } = useSetting()
    const [copied, setCopied] = useState(false)

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

    return (
        <footer className='w-full bg-(--vanilla-grey-6) text-(--core-white) border-t-4 border-(--core-grey-5) drop-shadow-[0_-4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-between'>
            {/* Main Content Area */}
            <div className='max-w-7xl w-full mx-auto px-6 lg:px-12 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>

                    {/* Brand & About Section (lg:col-span-5) */}
                    <div className='lg:col-span-5 flex flex-col gap-4'>
                        <div
                            className='cursor-pointer flex items-center gap-3'
                            onClick={() => router.push("/")}
                        >
                            {setting?.logo ? (
                                <Image
                                    alt="Logo"
                                    className='h-12 w-auto object-contain'
                                    src={setting.logo}
                                    width={260}
                                    height={50}
                                    unoptimized
                                />
                            ) : (
                                <Image
                                    alt="Logo"
                                    className='h-12 w-auto object-contain'
                                    loading='eager'
                                    src="https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/logos/Global-Header_MCCB-Logo_300x51.svg"
                                    width={260}
                                    height={50}
                                    unoptimized
                                />
                            )}
                        </div>

                        {/* Server Title & Description */}
                        <div>
                            <h2 className='font-pixel text-lg text-(--marketplace-gold-3) mb-1'>
                                {setting?.serverName || setting?.siteName || 'Minecraft Server'}
                            </h2>
                            <p className='text-(--core-grey-2) text-sm leading-relaxed line-clamp-4'>
                                {setting?.serverDesc || setting?.siteDesc || 'ยินดีต้อนรับสู่เซิร์ฟเวอร์ของเรา สังคมคุณภาพ พร้อมระบบที่หลากหลายและทันสมัย เข้าร่วมสนุกกับเราได้แล้ววันนี้'}
                            </p>
                        </div>
                    </div>

                    {/* Quick Navigation Links (lg:col-span-3) */}
                    <div className='lg:col-span-3 flex flex-col gap-3'>
                        <h3 className='font-pixel text-base text-(--core-green-3) tracking-wider border-b-2 border-(--core-grey-5) pb-2'>
                            NAVIGATION
                        </h3>
                        <ul className='flex flex-col gap-2'>
                            {NAV_ITEMS.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className='group flex items-center gap-2 text-sm text-(--core-grey-2) hover:text-(--core-green-3) transition-colors py-0.5'
                                    >
                                        <span className='text-(--core-grey-4) group-hover:text-(--core-green-3) transition-colors font-pixel text-xs'>
                                            ▸
                                        </span>
                                        <span className='font-pixel text-xs tracking-wide group-hover:translate-x-1 transition-transform'>
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Server IP Section (lg:col-span-4) */}
                    <div className='lg:col-span-4 flex flex-col gap-3'>
                        <div className='flex justify-between tracking-wider border-b-2 border-(--core-grey-5)'>
                            <h3 className='font-pixel text-base text-(--core-green-3) pb-2'>
                                Server Online
                            </h3>
                            {/* Online Players Indicator (matching Navbar) */}
                            <span className='font-bold text-sm'>{mcStatus?.playersOnline ?? 0}</span>
                        </div>
                        <div>
                            {/* Copy Button */}
                            <Button
                                color="Green"
                                variant="Solid"
                                className="text-sm! py-2! px-4!"
                                icon={copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                                onClick={handleCopyIp}
                                iconPosition="end"
                                block
                            >
                                <span className='font-pixel text-xs truncate'>
                                    {copied ? 'COPIED TO CLIPBOARD!' : (setting?.serverIp || 'play.easyshop.net')}
                                </span>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar / Copyright */}
            <div className='w-full bg-(--core-rich-black) py-4 px-6 lg:px-12 border-t-2 border-(--core-grey-5)'>
                <div className='max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-(--core-grey-3)'>
                    <p className='font-pixel text-center sm:text-left'>
                        © {new Date().getFullYear()} {setting?.siteName ?? 'Easyshop'}. All rights reserved.
                    </p>
                    <p className='font-pixel text-center sm:text-right'>
                        Easyshop by{' '}
                        <Link
                            className='text-(--default-focus) hover:underline'
                            href="https://www.facebook.com/Thitiphat.K"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Thitiphatx
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer