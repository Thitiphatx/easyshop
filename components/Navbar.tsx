import { AvatarCircle } from 'pixelarticons/react'
import React, { useMemo } from 'react'
import Button from './Button/Button'
import Select from './Select/Select'
import { ISelectItem } from './Select/interface'

const Navbar: React.FC = () => {

    const paths = useMemo(() => [
        {
            label: "Home",
            path: ""
        },
        {
            label: "TopUp",
            path: ""
        },
        {
            label: "Shop",
            path: ""
        },
        {
            label: "Guide",
            path: ""
        },
        {
            label: "Ranking",
            path: ""
        }
    ], [])

    const accountDropdownItems: ISelectItem[] = useMemo(() => [
        {
            label: "เข้าสู่ระบบ",
            href: ""
        },
        {
            label: "ออกจากระบบ",
            href: ""
        }
    ], [])

    return (
        <div className='w-full h-20 bg-(--mc-vanilla-grey-6) px-24 flex flex-nowrap justify-between drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)]'>
            {/* Left Section */}
            <div className='w-24 flex-1 flex items-center'>
                <img className='h-10' src="https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/logos/Global-Header_MCCB-Logo_300x51.svg" />
            </div>

            {/* Center Section */}
            <div className='w-24 flex-2'>
                <ul className='flex items-center h-full gap-2 w-fit mx-auto'>
                    {paths.map((path, index) => (
                        <li key={index}>
                            <Button variant='Ghost'>
                                {path.label.toUpperCase()}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Section */}
            <div className='flex justify-end items-center gap-6 h-full w-24 flex-1'>
                <div className='flex gap-2 ring-(--mc-core-green-5) ring-2 p-2'>
                    <span className='text-(--mc-core-green-3) font-bold text-sm'>99</span>
                    <span className='text-(--mc-core-white) font-bold text-sm'>Online</span>
                </div>
                <Select
                    variant='Ghost'
                    icon={<AvatarCircle width={24} height={24} />}
                    items={accountDropdownItems}
                >
                    ACCOUNT
                </Select>
            </div>
        </div>
    )
}

export default Navbar