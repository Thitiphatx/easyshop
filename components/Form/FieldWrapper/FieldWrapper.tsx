'use client'

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

    const errorMessages = useMemo(() => errors.map(getErrorMessage), [errors])

    return (
        <div className={`mb-3 ${className ?? ''}`}>
            <label
                htmlFor={htmlFor}
                className={`text-(--core-white) drop-shadow-xl text-xl flex ${layout === 'horizontal' ? 'flex-row items-center' : 'flex-col'
                    }`}
            >
                <span className="flex items-center gap-1 mb-2">
                    {label}
                    {required && <span className="text-(--default-warning)">*</span>}
                </span>
                {children}
            </label>

            {showError && (
                <div className="p-2 text-sm bg-(--default-warning) text-(--core-white) mt-2">{errorMessages.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}</div>
            )}
        </div>
    )
}