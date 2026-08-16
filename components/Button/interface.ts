export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "Link" | "Solid" | "Outline" | "Ghost";
    color?: "Green" |   "Gold" | "Blue" | "Purple" | "Default"
    icon?: React.ReactNode
    isActive?: boolean
}