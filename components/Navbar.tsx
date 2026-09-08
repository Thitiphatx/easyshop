"use client"
import { AvatarCircle } from 'pixelarticons/react'
import React, { useMemo } from 'react'
import Button from './Button/Button'
import Select from './Select/Select'
import { ISelectItem } from './Select/interface'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import Image from 'next/image'

const Navbar: React.FC = () => {
    const router = useRouter();
    const { session, signOut, openAuth } = useAuth()
    const { displaySetting, mcStatus } = useSetting()

    const paths = useMemo(() => [
        {
            label: "Home",
            path: "/"
        },
        {
            label: "TopUp",
            path: "/topup",
            children: [
                {
                    label: "True Wallet",
                    onClick: () => router.replace("/topup/truewallet")
                },
                {
                    label: "ธนาคาร",
                    onClick: () => router.replace("/topup/bank")
                }
            ]
        },
        {
            label: "Shop",
            path: "/shop"
        },
        {
            label: "Guide",
            path: "/guide"
        },
        {
            label: "Ranking",
            path: "/ranking"
        }
    ], [])

    const accountDropdownItems: ISelectItem[] = useMemo(() => [
        { label: `พ้อยท์: ${session?.point ?? 0}` },
        { label: "โปรไฟล์", onClick: () => router.push("/user/profile") },
        { label: "ประวัติการซื้อ", onClick: () => router.push("/user/purchase-history") },
        { label: "ประวัติการเติม", onClick: () => router.push("/user/topup-history") },
        { label: "ตั้งค่าเว็บช็อป", onClick: () => router.push("/setting/overview"), className: "hover:text-(--marketplace-gold-3)" },
        {
            label: "ออกจากระบบ", onClick: async () => {
                await signOut()
                router.refresh()
            },
            className: "hover:text-(--default-warning)"
        },
    ], [session, openAuth, signOut, router])


    return (
        <div className='w-full h-20 bg-(--vanilla-grey-6) px-24 flex flex-nowrap justify-between drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)]'>
            {/* Left Section */}
            <div className='w-24 flex-1 flex items-center'>
                <div className='cursor-pointer' onClick={() => router.push("/")}>
                    {displaySetting?.logo
                        ? <Image alt="Logo" className='h-10 w-auto' src={displaySetting.logo} width={200} height={40} />
                        : <Image alt="Logo" className='h-10 w-auto' src="https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/logos/Global-Header_MCCB-Logo_300x51.svg" width={200} height={40} />}
                </div>
            </div>

            {/* Center Section */}
            <div className='w-24 flex-2'>
                <ul className='flex items-center justify-center h-full mx-auto'>
                    {paths.map((path, index) => (
                        <li key={index}>

                            {path.children ? (
                                <Select
                                    variant='Ghost'
                                    items={path.children}
                                    className='text-sm! p-4!'
                                >
                                    {path.label.toUpperCase()}
                                </Select>
                            ) : (
                                <Button variant='Ghost' className='text-sm! p-4!' onClick={() => router.replace(path.path)}>
                                    {path.label.toUpperCase()}
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Section */}
            <div className='flex justify-end items-center gap-6 h-full w-24 flex-1'>
                <div className='flex gap-2 ring-(--core-green-5) ring-2 p-2'>
                    <span className='text-(--core-green-3) font-bold text-sm'>{mcStatus?.playersOnline ?? 0}</span>
                    <span className='text-(--core-white) font-bold text-sm'>Online</span>
                </div>
                {session ? (
                    <Select
                        variant='Ghost'
                        icon={<Image src={`https://mc-heads.net/avatar/${session.username}/24`} alt={session.username} width={24} height={24} />}
                        items={accountDropdownItems}
                    >
                        Account
                    </Select>
                ) : (
                    <Button onClick={openAuth}>เข้าสู่ระบบ</Button>
                )}

            </div>
        </div>
    )
}

export default Navbar