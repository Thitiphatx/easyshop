'use client'

import Button from '@/components/Button/Button'
import { useFormContext } from '../context'
import type { ISubmitButtonProps } from './interface'

export function SubmitButton({ children, ...buttonProps }: ISubmitButtonProps) {
    const form = useFormContext()

    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
            {([canSubmit, isSubmitting]) => (
                <Button type="submit" color="Green" disabled={!canSubmit} {...buttonProps}>
                    {isSubmitting ? 'กำลังส่ง...' : children}
                </Button>
            )}
        </form.Subscribe>
    )
}