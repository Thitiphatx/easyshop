'use client'

import { useFieldContext } from '../context'
import { IFieldWrapperProps } from './interface'

export function FieldWrapper({ label, required, children }: IFieldWrapperProps) {
    const field = useFieldContext()
    const errors = field.state.meta.errors
    const showError = field.state.meta.isTouched && errors.length > 0

    return (
        <div className="field-group">
            <label className="field-label">
                {label}
                {required && <span className="field-required">*</span>}
            </label>

            {children}

            {field.state.meta.isValidating && (
                <span className="field-validating">กำลังตรวจสอบ...</span>
            )}

            {showError && (
                <span className="field-error">{errors.join(', ')}</span>
            )}
        </div>
    )
}