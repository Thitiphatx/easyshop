'use client'

import { useFormContext } from '../context'
import type { IResetButtonProps } from './interface'

export function ResetButton({ children, ...buttonProps }: IResetButtonProps) {
    const form = useFormContext()

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => form.reset()}
                    className="field-reset"
                    {...buttonProps}
                >
                    {children}
                </button>
            )}
        </form.Subscribe>
    )
}