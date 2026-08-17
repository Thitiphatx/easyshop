import React from 'react'
import { ICheckboxProps } from './interface'
import { Check } from 'pixelarticons/react'

const Checkbox: React.FC<ICheckboxProps> = ({
    id,
    checked,
    onChange,
    onBlur,
}) => {
    return (
        <div className="relative inline-flex items-center justify-center size-6">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                onBlur={onBlur}
                className="peer appearance-none size-6 border-2 border-(--core-grey-4) hover:border-(--core-grey-3) bg-(--core-grey-5) checked:bg-(--core-green-3) checked:border-(--core-grey-5) cursor-pointer transition-colors"
            />
            <Check
                className="pointer-events-none absolute size-4 text-white opacity-0 peer-checked:opacity-100"
                width={18}
                height={18}
            />
        </div>
    )
}

export default Checkbox