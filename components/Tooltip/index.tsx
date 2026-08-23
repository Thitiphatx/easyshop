import React from 'react'
import { ITooltipProps } from './interface'

const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
}

const arrowClasses: Record<string, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-slate-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-slate-900',
}

const Tooltip: React.FC<ITooltipProps> = ({ children, content, position = 'top', mode = 'hover' }) => {
    if (!content) return <>{children}</>

    const showHover = mode === 'hover' || mode === 'both'
    const showFocus = mode === 'focus' || mode === 'both'

    const containerZIndex = [
        'relative inline-flex group w-full',
        showHover ? 'hover:z-50' : '',
        showFocus ? 'focus-within:z-50' : '',
    ].filter(Boolean).join(' ')

    const tooltipVisibilityClasses = [
        showHover ? 'group-hover:opacity-100 group-hover:scale-100' : '',
        showFocus ? 'group-focus-within:opacity-100 group-focus-within:scale-100' : '',
    ].filter(Boolean).join(' ')

    return (
        <div className={containerZIndex}>
            {children}
            <div
                role="tooltip"
                className={`absolute ${positionClasses[position] || positionClasses.top} z-999 w-max px-3 py-1.5 text-(--core-rich-black) bg-(--core-grey-2) pointer-events-none opacity-0 scale-95 transition-all duration-200 ease-out ${tooltipVisibilityClasses}`}
            >
                {content}
            </div>
        </div>
    )
}

export default Tooltip