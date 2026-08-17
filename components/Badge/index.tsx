import React from 'react'
import { IBadgeProps } from './interface'
import clsx from 'clsx'
import { ColorVariant } from '@/app/interface'

const colorStyle: Record<ColorVariant, string> = {
    Green: clsx("bg-(--core-green-3) text-(--core-rich-black)"),
    Default: clsx("bg-(--core-off-black) text-(--core-white) border-b-1 border-b-(--core-grey-5)"),
    Gold: '',
    Blue: '',
    Purple: ''
}

const Badge: React.FC<IBadgeProps> = ({
    color = "Default",
    className,
    children,
    ...props
}) => {
    const currentColor = colorStyle[color]

    return (
        <div {...props} className={clsx("w-fit p-1 text-sm", currentColor, className)}>
            {children}
        </div>
    )
}

export default Badge