import React from 'react'
import { IInputProps } from './interface'

const Input: React.FC<IInputProps> = ({
    className,
    ...props
}) => {
    return (
        <input
            className={`p-5 bg-(--mc-core-grey-6) text-(--mc-core-grey-2) text-xl font-bold font-pixel ${className}`}
            {...props}
        />
    )
}

export default Input