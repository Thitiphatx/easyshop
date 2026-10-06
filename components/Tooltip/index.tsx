'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { ITooltipProps } from './interface'

const Tooltip: React.FC<ITooltipProps> = ({
    children,
    content,
    position = 'top',
    mode = 'hover',
    className,
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    const updateCoords = useCallback(() => {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        if (position === 'bottom') {
            setCoords({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2,
            })
        } else {
            setCoords({
                top: rect.top - 8,
                left: rect.left + rect.width / 2,
            })
        }
    }, [position])

    const show = () => {
        updateCoords()
        setIsVisible(true)
    }

    const hide = () => {
        setIsVisible(false)
    }

    useEffect(() => {
        if (!isVisible) return

        const handleScrollOrResize = () => {
            updateCoords()
        }

        window.addEventListener('scroll', handleScrollOrResize, true)
        window.addEventListener('resize', handleScrollOrResize)

        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true)
            window.removeEventListener('resize', handleScrollOrResize)
        }
    }, [isVisible, updateCoords])

    if (!content) return <>{children}</>

    const showHover = mode === 'hover' || mode === 'both'
    const showFocus = mode === 'focus' || mode === 'both'

    return (
        <div
            ref={triggerRef}
            className={clsx('relative inline-flex w-full justify-center', className)}
            onMouseEnter={showHover ? show : undefined}
            onMouseLeave={showHover ? hide : undefined}
            onFocus={showFocus ? show : undefined}
            onBlur={showFocus ? hide : undefined}
        >
            {children}
            {isVisible && coords && createPortal(
                <div
                    role="tooltip"
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        transform: position === 'bottom' ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
                        zIndex: 99999,
                    }}
                    className="w-max max-w-xs px-3 py-1.5 text-xs text-(--core-rich-black) bg-(--core-grey-2) pointer-events-none shadow-lg select-none whitespace-normal break-words"
                >
                    {content}
                </div>,
                document.body
            )}
        </div>
    )
}

export default Tooltip