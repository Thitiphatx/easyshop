import React from 'react'
import { ITextareaProps } from './interface'

const Textarea: React.FC<ITextareaProps> = ({
    className,
    isError,
    rows = 3,
    ...props
}) => {
    return (
        <textarea
            rows={rows}
            className={`p-3 focus:ring-2 ring-(--core-grey-1) border-2 border-(--core-grey-4) bg-(--core-off-black) text-(--core-grey-2) text-lg outline-none resize-y ${isError ? 'ring-2 ring-(--default-warning)' : ''} ${className ?? ''}`}
            {...props}
        />
    )
}

export default Textarea
