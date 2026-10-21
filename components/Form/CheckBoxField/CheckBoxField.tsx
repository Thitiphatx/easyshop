'use client'

import { useId } from 'react'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import Checkbox from '@/components/Checkbox/Checkbox'
import Tooltip from '@/components/Tooltip/index'
import { InfoBox } from 'pixelarticons/react'
import clsx from 'clsx'
import { ICheckBoxFieldProps } from './interface'

export function CheckBoxField({ label, className, labelClassName, variant, tooltip, disabled }: ICheckBoxFieldProps) {
    const field = useFieldContext<boolean>()
    const id = useId()

    return (
        <FieldWrapper htmlFor={id} layout="horizontal" className={clsx("", className)}>
            <div className="flex items-center justify-start">
                <Checkbox
                    id={id}
                    variant={variant}
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    onBlur={field.handleBlur}
                    disabled={disabled}
                />
                <span className={`ml-2 text-shadow inline-flex items-center gap-1 transition-opacity ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${labelClassName ?? ''}`}>
                    {label}
                    {tooltip && (
                        <Tooltip content={tooltip} position='bottom' mode='hover' className="w-auto! justify-start!">
                            <InfoBox className="w-4 h-4 opacity-50 cursor-help" />
                        </Tooltip>
                    )}
                </span>
            </div>
        </FieldWrapper>
    )
}