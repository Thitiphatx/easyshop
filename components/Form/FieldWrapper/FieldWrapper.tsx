'use client'

import Tooltip from '@/components/Tooltip'
import { useCallback, useMemo } from 'react'
import { useFieldContext } from '../context'
import { IFieldWrapperProps } from './interface'

export function FieldWrapper({
    label,
    required,
    htmlFor,
    layout = 'vertical',
    className,
    children,
    tooltip,
}: IFieldWrapperProps) {
    const field = useFieldContext()
    const errors = field.state.meta.errors
    const showError = field.state.meta.isTouched && errors.length > 0

    const getErrorMessage = useCallback((error: unknown) => {
        if (typeof error === 'string') return error
        if (error && typeof error === 'object' && 'message' in error) {
            return String((error as { message: unknown }).message)
        }
        return 'ข้อมูลไม่ถูกต้อง'
    }, [])

    const errorMessages = useMemo(() => errors.map(getErrorMessage), [errors, getErrorMessage])

    return (
        <div className={`relative mb-3 hover:z-30 focus-within:z-30 ${className ?? ''}`}>
            <label
                htmlFor={htmlFor}
                className={`text-(--core-white) drop-shadow-xl flex ${layout === 'horizontal' ? 'flex-col sm:flex-row sm:items-center has-[textarea]:sm:items-start has-[textarea]:[&>span:first-child]:sm:pt-3 gap-1.5 sm:gap-4' : 'flex-col'
                    }`}
            >
                {(label || required) && (
                    <span className={`flex items-center gap-1 shrink-0 ${layout === 'horizontal' ? 'mb-1 sm:mb-0' : 'mb-2'}`}>
                        {label}
                        {required && <span className="text-(--default-warning)">*</span>}
                    </span>
                )}
                <span className={layout === 'horizontal' ? 'w-full sm:flex-1' : ''}>
                    {tooltip ? <Tooltip content={tooltip} position='bottom' mode='focus'>
                        {children}
                    </Tooltip> : children}
                </span>
            </label>
            {showError && (
                <div className="p-2 text-sm bg-(--default-warning) text-(--core-white) mt-2">{errorMessages.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}</div>
            )}
        </div>
    )
}