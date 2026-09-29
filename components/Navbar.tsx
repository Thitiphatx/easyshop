"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Button from './Button/Button'
import Select from './Select/Select'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import Image from 'next/image'
import AccountMenu from './Navbar/AccountMenu'
import {
    Close,
    Menu,
    ChevronDown,
    ChevronRight,
    Crown,
    Wallet,
    User,
    ShoppingBag,
    CreditCard,
    Settings2,
    Logout
} from 'pixelarticons/react'

const Navbar: React.FC = () => {
    const router = useRouter();
    const { session, openAuth, signOut } = useAuth()
    const { setting, mcStatus } = useSetting()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileTopupOpen, setIsMobileTopupOpen] = useState(false)

    const paths: Array<{ label: string; path: string; children?: any }> = useMemo(() => [
        {
            label: "Home",
            path: "/"
        },
        {
            label: "TopUp",
            path: "/topup",
        },
        {
            label: "Shop",
            path: "/shop"
        },
        {
            label: "Ranking",
            path: "/ranking"
        }
    ], [router])

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMobileNavigate = (url: string) => {
        setIsMobileMenuOpen(false);
        router.replace(url);
    };

    return (
        <div className="relative w-full">
            <div
                className={`w-full h-20 px-4 sm:px-8 lg:px-24 flex items-center justify-between transition-all duration-300 sticky top-0 z-50 ${isScrolled
                    ? "bg-(--vanilla-grey-6)/90 backdrop-blur-md drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)]"
                    : "bg-(--vanilla-grey-6) drop-shadow-none"
                    }`}
            >
                {/* Left Section (Logo) */}
                <div className='w-full' onClick={() => { setIsMobileMenuOpen(false); router.push("/"); }}>
                    {setting?.logo ? (
                        <Image alt="Logo" className='h-10 sm:h-12 w-auto cursor-pointer ' src={setting.logo} width={260} height={50} />
                    ) : (
                        <Image
                            alt="Logo"
                            className='h-10 sm:h-12 w-auto cursor-pointer'
                            loading='eager'
                            src="https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/logos/Global-Header_MCCB-Logo_300x51.svg"
                            width={260}
                            height={50}
                        />
                    )}
                </div>

                {/* Center Section (Desktop Navigation) */}
                <div className='hidden lg:flex justify-center w-full'>
                    <ul className='flex items-center justify-center h-full mx-auto'>
                        {paths.map((path, index) => (
                            <li key={index}>
                                {path.children ? (
                                    <Select
                                        variant='Ghost'
                                        items={path.children}
                                        className='text-sm! p-4!'
                                        color="Green"
                                    >
                                        {path.label.toUpperCase()}
                                    </Select>
                                ) : (
                                    <Button
                                        variant='Ghost'
                                        color="Green"
                                        className='text-sm! p-4!'
                                        onClick={() => router.replace(path.path)}
                                    >
                                        {path.label.toUpperCase()}
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section */}
                <div className='flex items-center justify-end gap-3 sm:gap-6 w-full'>
                    {/* Players Online Badge */}
                    <div className='hidden sm:flex gap-2 ring-(--core-green-5) ring-2 p-1.5 sm:p-2 bg-(--core-off-black)/40'>
                        <span className='text-(--core-green-3) font-bold text-xs sm:text-sm'>{mcStatus?.playersOnline ?? 0}</span>
                        <span className='text-(--core-white) font-bold text-xs sm:text-sm'>Online</span>
                    </div>

                    {/* Account button visible on desktop only */}
                    <div className="hidden lg:flex">
                        {session ? <AccountMenu /> : <Button onClick={openAuth} className="text-xs sm:text-sm! py-2! px-3 sm:px-4!">เข้าสู่ระบบ</Button>}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="lg:hidden flex items-center justify-center p-2 text-(--core-white) hover:text-(--core-green-3) bg-(--core-grey-5) border-2 border-(--core-grey-4) active:bg-(--core-grey-4) cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <Close className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-20 bg-(--vanilla-grey-6) border-b-4 border-(--core-green-5) drop-shadow-[0_8px_0px_rgba(0,0,0,0.5)] z-40 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
                    <div className="p-4 flex flex-col gap-2">
                        {/* Account Section in Burger Menu */}
                        {session ? (
                            <div className="flex flex-col bg-(--core-off-black)/80 border-2 border-(--core-grey-5) p-3 mb-2">
                                {/* Profile Bar */}
                                <div
                                    className="flex items-center gap-3 cursor-pointer pb-3 border-b border-(--core-grey-5)"
                                    onClick={() => handleMobileNavigate('/user/profile')}
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={session.profileImageUrl || `https://mc-heads.net/avatar/${session.username}/48`}
                                            alt={session.username}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 object-contain [image-rendering:pixelated] ring-1 ring-(--core-green-5) bg-(--core-off-black)"
                                        />
                                        {session.isAdmin && (
                                            <div className="absolute -top-1.5 -right-1.5 bg-(--marketplace-gold-5) text-(--core-rich-black) p-0.5 border border-(--marketplace-gold-3)">
                                                <Crown className="size-2.5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-pixel text-sm font-bold text-(--core-white) truncate">
                                            {session.username}
                                        </span>
                                        <span className="font-pixel text-xs text-(--marketplace-gold-3) flex items-center gap-1">
                                            <Wallet className="size-3" />
                                            {(session.point ?? 0).toLocaleString()} P
                                        </span>
                                    </div>
                                </div>

                                {/* Profile Quick Links */}
                                <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs font-pixel">
                                    <button
                                        type="button"
                                        onClick={() => handleMobileNavigate('/user/profile')}
                                        className="flex items-center gap-1.5 p-2 text-(--core-grey-2) hover:text-(--core-white) hover:bg-(--core-grey-5) cursor-pointer"
                                    >
                                        <User className="size-3.5 text-(--core-green-3)" />
                                        <span>ข้อมูลส่วนตัว</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMobileNavigate('/user/purchase-history')}
                                        className="flex items-center gap-1.5 p-2 text-(--core-grey-2) hover:text-(--core-white) hover:bg-(--core-grey-5) cursor-pointer"
                                    >
                                        <ShoppingBag className="size-3.5 text-(--core-green-3)" />
                                        <span>ประวัติซื้อ</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMobileNavigate('/user/topup-history')}
                                        className="flex items-center gap-1.5 p-2 text-(--core-grey-2) hover:text-(--core-white) hover:bg-(--core-grey-5) cursor-pointer"
                                    >
                                        <CreditCard className="size-3.5 text-(--core-green-3)" />
                                        <span>ประวัติเติม</span>
                                    </button>
                                    {session.isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('/webshop/dashboard')}
                                            className="flex items-center gap-1.5 p-2 text-(--marketplace-gold-3) hover:text-(--marketplace-gold-2) hover:bg-(--core-grey-5) cursor-pointer"
                                        >
                                            <Settings2 className="size-3.5" />
                                            <span>จัดการร้าน</span>
                                        </button>
                                    )}
                                </div>

                                <div className="pt-2 mt-2 border-t border-(--core-grey-5)">
                                    <Button
                                        color="Red"
                                        variant="Retro"
                                        block
                                        className="py-1.5! text-xs! font-pixel justify-center"
                                        icon={<Logout className="size-4" />}
                                        onClick={async () => {
                                            setIsMobileMenuOpen(false);
                                            await signOut();
                                            router.refresh();
                                        }}
                                    >
                                        ออกจากระบบ
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-2">
                                <Button
                                    color="Green"
                                    block
                                    className="py-2.5! text-sm! font-pixel justify-center"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openAuth();
                                    }}
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            </div>
                        )}

                        {/* Mobile Online status on xs */}
                        <div className="sm:hidden flex items-center justify-between p-2.5 bg-(--core-off-black)/60 border border-(--core-grey-5) mb-2">
                            <span className="font-pixel text-xs text-(--core-grey-2)">Server Status:</span>
                            <div className="flex items-center gap-1.5 font-pixel text-xs">
                                <span className="inline-block size-2 rounded-full bg-(--core-green-3) animate-pulse" />
                                <span className="text-(--core-green-3) font-bold">{mcStatus?.playersOnline ?? 0}</span>
                                <span className="text-(--core-white)">Online</span>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <Button
                            variant="Ghost"
                            color="Green"
                            block
                            className="text-left! justify-start! py-3! font-pixel text-sm!"
                            onClick={() => handleMobileNavigate('/')}
                        >
                            HOME
                        </Button>

                        {/* TopUp with Submenu */}
                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={() => setIsMobileTopupOpen((prev) => !prev)}
                                className="w-full flex items-center justify-between p-3 font-pixel text-sm text-(--core-white) hover:text-(--core-green-3) hover:bg-(--core-grey-5) transition-colors cursor-pointer"
                            >
                                <span>TOPUP</span>
                                {isMobileTopupOpen ? <ChevronDown className="size-5 text-(--core-green-3)" /> : <ChevronRight className="size-5" />}
                            </button>
                            {isMobileTopupOpen && (
                                <div className="pl-4 flex flex-col gap-1.5 py-2 bg-(--core-off-black)/30 border-l-2 border-(--core-green-5) my-1">
                                    <button
                                        type="button"
                                        onClick={() => handleMobileNavigate('/topup/truewallet')}
                                        className="w-full text-left p-2 text-sm text-(--core-grey-2) hover:text-(--core-green-3) hover:bg-(--core-grey-5) cursor-pointer"
                                    >
                                        ▸ True Wallet
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMobileNavigate('/topup/bank')}
                                        className="w-full text-left p-2 text-sm text-(--core-grey-2) hover:text-(--core-green-3) hover:bg-(--core-grey-5) cursor-pointer"
                                    >
                                        ▸ ธนาคาร
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="Ghost"
                            color="Green"
                            block
                            className="text-left! justify-start! py-3! font-pixel text-sm!"
                            onClick={() => handleMobileNavigate('/shop')}
                        >
                            SHOP
                        </Button>

                        <Button
                            variant="Ghost"
                            color="Green"
                            block
                            className="text-left! justify-start! py-3! font-pixel text-sm!"
                            onClick={() => handleMobileNavigate('/ranking')}
                        >
                            RANKING
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar