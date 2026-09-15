"use client"
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'pixelarticons/react'
import { ISelectProps } from './interface'
import Button from '../Button/Button'
import Card from '../Card/Card'
import clsx from 'clsx'
import { useAuth } from '@/app/contexts/authContext'

const Select: React.FC<ISelectProps> = ({
    variant = "Solid",
    icon,
    items,
    children,
    className,
    ...props
}) => {
    const [isEnableDropdown, setIsEnableDropdown] = useState(false)
    const { session } = useAuth()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsEnableDropdown(false)
            }
        }

        if (isEnableDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isEnableDropdown])

    const handleItemClick = (itemOnClick?: () => void) => {
        itemOnClick?.()
        setIsEnableDropdown(false)
    }

    return (
        <div ref={containerRef} className="relative inline-block">
            <Button
                variant={variant}
                color="Green"
                icon={icon}
                onClick={() => setIsEnableDropdown((prev) => !prev)}
                isActive={isEnableDropdown}
                className={`${className}`}
                {...props}
            >
                <div className='flex items-center gap-2'>
                    <span>{children}</span>
                    {isEnableDropdown ? (
                        <ChevronUp width={18} height={18} />
                    ) : (
                        <ChevronDown width={18} height={18} />
                    )}
                </div>
            </Button>

            {/* Dropdown */}
            {isEnableDropdown && (
                <Card className='absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max z-50'>
                    <ul>
                        {items?.map((item, index) => (
                            <li key={index} className='not-last:border-b border-(--core-grey-5)' hidden={item.hidden}>
                                <Button
                                    hidden={!session?.isAdmin && item.isAdmin}
                                    className={clsx('p-2 w-full text-left!', item.className)}
                                    onClick={() => handleItemClick(item.onClick)}
                                    variant='Ghost'
                                    color="Green"
                                >
                                    {item.label}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    )
}

export default Select