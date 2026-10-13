import React from 'react'
import { Store, Server, CreditCard, Crown, Check } from 'pixelarticons/react'
import clsx from 'clsx'
import { IStepperProps } from './interface'

const steps = [
    { number: 1, title: 'Webshop', icon: Store },
    { number: 2, title: 'Server', icon: Server },
    { number: 3, title: 'Topup', icon: CreditCard },
    { number: 4, title: 'Admin', icon: Crown },
]

export const Stepper: React.FC<IStepperProps> = ({ currentStep }) => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between relative">
                {/* Connecting background line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-(--core-grey-5) z-0" />
                
                {/* Active progress line */}
                <div
                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-(--core-green-5) transition-all duration-300 z-0"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                />

                {steps.map((step) => {
                    const Icon = step.icon
                    const isCompleted = step.number < currentStep
                    const isCurrent = step.number === currentStep

                    return (
                        <div key={step.number} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={clsx(
                                    'size-11 sm:size-13 flex items-center justify-center transition-all duration-200 border-2 font-pixel text-sm sm:text-base select-none',
                                    isCompleted && 'bg-(--core-green-6) border-(--core-green-3) text-(--core-white) shadow-[0_4px_0_rgba(0,0,0,0.3)]',
                                    isCurrent && 'bg-(--core-grey-6) border-(--core-gold-3) text-(--core-gold-3) shadow-[0_4px_0_rgba(0,0,0,0.4)] scale-110',
                                    !isCompleted && !isCurrent && 'bg-(--core-grey-6) border-(--core-grey-4) text-(--core-grey-3)'
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="size-5 sm:size-6 text-(--core-green-2)" />
                                ) : (
                                    <Icon className={clsx("size-5 sm:size-6", isCurrent ? "text-(--core-gold-3)" : "text-(--core-grey-3)")} />
                                )}
                            </div>
                            <span
                                className={clsx(
                                    'mt-2 text-xs sm:text-sm font-pixel transition-colors',
                                    isCurrent && 'text-(--core-gold-3) font-bold',
                                    isCompleted && 'text-(--core-green-3)',
                                    !isCompleted && !isCurrent && 'text-(--core-grey-3)'
                                )}
                            >
                                {step.title}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Stepper
