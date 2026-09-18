import React from 'react'
import { ICheckboxProps } from './interface'
import { Check } from 'pixelarticons/react'

const Checkbox: React.FC<ICheckboxProps> = ({
    id,
    checked,
    onChange,
    onBlur,
    variant = 'normal',
    disabled,
}) => {
    if (variant === 'switch') {
        return (
            <label htmlFor={id} className={`relative inline-flex items-center select-none ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}>
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className="sr-only peer"
                />
                {/* track */}
                <div className="
                    w-11 h-6 rounded-none border-2
                    border-(--core-grey-4) bg-(--core-grey-5)
                    peer-checked:bg-(--core-green-3) peer-checked:border-(--core-green-3)
                    transition-colors duration-200
                " />
                {/* thumb */}
                <div className="
                    absolute left-0.5 top-0.5 size-[18px] rounded-none bg-white shadow
                    transition-transform duration-200
                    peer-checked:translate-x-5
                " />
            </label>
        )
    }

    return (
        <div className="relative inline-flex items-center justify-center size-6">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={`peer appearance-none size-6 border-2 border-(--core-grey-4) bg-(--core-grey-5) checked:bg-(--core-green-3) checked:border-(--core-grey-5) transition-colors ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-(--core-grey-3)'}`}
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