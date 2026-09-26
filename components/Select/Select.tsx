import React from 'react'
import { ISelectProps } from './interface'

const Select: React.FC<ISelectProps> = ({
    className,
    isError,
    placeholder,
    options,
    children,
    ...props
}) => {
    return (
        <select
            className={`p-3 focus:ring-2 ring-(--core-grey-1) border-2 border-(--core-grey-4) bg-(--core-off-black) text-(--core-grey-2) text-lg outline-none w-full ${isError ? 'ring-2 ring-(--default-warning)' : ''} ${className ?? ''}`}
            {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
            {children}
        </select>
    )
}

export { Select }
export default Select