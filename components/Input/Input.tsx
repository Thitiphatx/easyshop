import React from 'react'
import { IInputProps } from './interface'

const Input: React.FC<IInputProps> = ({
    className,
    isError,
    ...props
}) => {
    return (
        <input
            className={`p-3 focus:ring-2 ring-(--core-grey-1) border-2 border-(--core-grey-4) bg-(--core-off-black) text-(--core-grey-2) text-lg outline-none ${isError ? 'ring-2 ring-(--default-warning)' : ''} ${className}`}
            {...props}
        />
    )
}

export default Input