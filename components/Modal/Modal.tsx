"use client"
import React from 'react'
import { Close } from 'pixelarticons/react'
import clsx from 'clsx'
import Card from '../Card/Card'
import Button from '../Button/Button'
import { IModalProps } from './interface'

const Modal: React.FC<IModalProps> = ({
    modalTitle,
    isOpen,
    setIsOpen,
    canClose = true,
    canClickOutsideClose = true,
    children,
    ...props
}) => {
    if (!isOpen) return null

    const handleBackdropClick = () => {
        if (canClickOutsideClose && canClose) {
            setIsOpen(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-(--core-off-black)/90"
                onClick={handleBackdropClick}
            />

            {/* Card Modal */}
            <Card
                {...props}
                className={clsx("relative z-10 w-125! max-h-screen overflow-y-auto", props.className)}
                cardTitle={
                    modalTitle !== undefined ? (
                        <div className="flex justify-between items-center">
                            <span>{modalTitle}</span>
                            {canClose && (
                                <Button
                                    variant="Ghost"
                                    icon={<Close />}
                                    isIconOnly
                                    onClick={() => setIsOpen(false)}
                                />
                            )}
                        </div>
                    ) : canClose ? (
                        <div className="flex justify-end">
                            <Button
                                variant="Ghost"
                                icon={<Close />}
                                isIconOnly
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                    ) : undefined
                }
            >
                {children}
            </Card>
        </div>
    )
}

export default Modal
