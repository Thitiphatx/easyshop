import React from 'react'
import { IInputProps } from './interface'

const Input: React.FC<IInputProps> = ({
    className,
    isError,
    ...props
}) => {
    return (
        <input
            className={`p-5 bg-(--core-off-black) text-(--core-grey-2) text-xl font-bold font-pixel outline-none ${isError ? 'ring-2 ring-(--default-warning)' : ''} ${className}`}
            {...props}
        />
    )
}

export default Input