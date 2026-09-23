'use client'

import Button from '@/components/Button/Button'
import { useFormContext } from '../context'
import type { IResetButtonProps } from './interface'

export function ResetButton({ children, ...buttonProps }: IResetButtonProps) {
    const form = useFormContext()

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button type="reset" disabled={isSubmitting} {...buttonProps}>
                    {isSubmitting ? 'กำลังส่ง...' : children}
                </Button>
            )}
        </form.Subscribe>
    )
}