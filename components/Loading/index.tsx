import React from 'react'

interface LoadingProps {
    text?: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
    sm: { block: 'w-3 h-3', gap: 'gap-1.5', font: 'text-xs' },
    md: { block: 'w-4 h-4', gap: 'gap-2', font: 'text-sm' },
    lg: { block: 'w-6 h-6', gap: 'gap-3', font: 'text-base' },
}

const Loading: React.FC<LoadingProps> = ({ text = 'LOADING', size = 'md' }) => {
    const { block, gap, font } = sizeMap[size]

    return (
        <div className="flex flex-col items-center justify-center gap-4 select-none">
            {/* Pixel marching blocks */}
            <div className={`flex items-end ${gap}`}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`${block} bg-[var(--core-green-3)]`}
                        style={{
                            imageRendering: 'pixelated',
                            animation: `pixel-march 0.6s steps(4) infinite`,
                            animationDelay: `${i * 0.12}s`,
                            boxShadow: '2px 2px 0 var(--core-green-6)',
                        }}
                    />
                ))}
            </div>

            {/* Pixel scan bar */}
            <div
                className="relative overflow-hidden h-[4px] w-32 bg-[var(--core-grey-5)]"
                style={{ imageRendering: 'pixelated' }}
            >
                {/* pixel-grid overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, var(--core-grey-6) 0px, var(--core-grey-6) 1px, transparent 1px, transparent 4px)',
                    }}
                />
                <div
                    className="absolute top-0 bottom-0 w-8 bg-[var(--core-green-3)]"
                    style={{
                        animation: 'pixel-scan 2s steps(20) infinite',
                        boxShadow: '0 0 6px var(--core-green-2)',
                    }}
                />
            </div>

            {/* Blinking pixel text */}
            <div className={`flex ${gap}`}>
                {text.split('').map((char, i) => (
                    <span
                        key={i}
                        className={`${font} font-pixel text-[var(--core-green-2)] tracking-widest`}
                        style={{
                            animation: `pixel-blink 1s steps(1) infinite`,
                            animationDelay: `${i * 0.07}s`,
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
                <span
                    className={`${font} font-pixel text-[var(--core-green-2)]`}
                    style={{ animation: 'pixel-blink 0.8s steps(1) infinite' }}
                >
                    _
                </span>
            </div>
        </div>
    )
}

export default Loading