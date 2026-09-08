export type TooltipPosition = 'top' | 'bottom'
export type TooltipMode = 'hover' | 'focus' | 'both'

export interface ITooltipProps {
    position?: TooltipPosition
    mode?: TooltipMode
    content: React.ReactNode
    children: React.ReactNode
    className?: string
}