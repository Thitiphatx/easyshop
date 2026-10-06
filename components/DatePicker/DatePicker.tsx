import React from 'react'
import { IDatePickerProps } from './interface'

const DatePicker: React.FC<IDatePickerProps> = ({
    className,
    isError,
    ...props
}) => {
    return (
        <input
            type="date"
            className={`p-3 focus:ring-2 ring-(--core-grey-1) border-2 border-(--core-grey-4) bg-(--core-off-black) text-(--core-grey-2) text-lg outline-none ${isError ? 'ring-2 ring-(--default-warning)' : ''} ${className}`}
            {...props}
        />
    )
}

export default DatePicker
