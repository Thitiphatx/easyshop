"use client"
import React from 'react'
import { IButtonProps } from './interface'
import clsx from 'clsx'

type ColorTokens = {
  base: string        // main background shade
  hover: string        // background on hover (solid variant)
  active: string        // background on active/press (solid variant)
  borderTop: string      // top border accent (solid variant, lighter)
  borderBottom: string    // bottom border accent (solid variant, darker)
  text: string        // text/border color for outline & link variants
  textActive: string      // text color when active (ghost variant)
  subtleHover: string    // faint bg on hover (outline variant)
  subtleActive: string    // faint bg on active (outline variant)
}

// 1. Color Tokens — color data ONLY, no layout/structure decisions
const colorTokens: Record<NonNullable<IButtonProps['color']>, ColorTokens> = {
  Green: {
    base: "bg-(--mc-core-green-5)",
    hover: "hover:bg-(--mc-core-green-4)",
    active: "active:bg-(--mc-core-green-6)",
    borderTop: "border-t-(--mc-core-green-3)",
    borderBottom: "border-b-(--mc-core-green-6)",
    text: "text-(--mc-core-green-3)",
    textActive: "text-(--mc-core-green-3)",
    subtleHover: "hover:bg-(--mc-core-green-1)",
    subtleActive: "active:bg-(--mc-core-green-2)",
  },
  Gold: {
    base: "bg-(--mc-core-gold-5)",
    hover: "hover:bg-(--mc-core-gold-4)",
    active: "active:bg-(--mc-core-gold-6)",
    borderTop: "border-t-(--mc-core-gold-3)",
    borderBottom: "border-b-(--mc-core-gold-6)",
    text: "text-(--mc-core-gold-3)",
    textActive: "text-(--mc-core-gold-3)",
    subtleHover: "hover:bg-(--mc-core-gold-1)",
    subtleActive: "active:bg-(--mc-core-gold-2)",
  },
  Blue: {
    base: "bg-(--mc-core-blue-5)",
    hover: "hover:bg-(--mc-core-blue-4)",
    active: "active:bg-(--mc-core-blue-6)",
    borderTop: "border-t-(--mc-core-blue-3)",
    borderBottom: "border-b-(--mc-core-blue-6)",
    text: "text-(--mc-core-blue-3)",
    textActive: "text-(--mc-core-blue-3)",
    subtleHover: "hover:bg-(--mc-core-blue-1)",
    subtleActive: "active:bg-(--mc-core-blue-2)",
  },
  Purple: {
    base: "bg-(--mc-core-purple-5)",
    hover: "hover:bg-(--mc-core-purple-4)",
    active: "active:bg-(--mc-core-purple-6)",
    borderTop: "border-t-(--mc-core-purple-3)",
    borderBottom: "border-b-(--mc-core-purple-6)",
    text: "text-(--mc-core-purple-3)",
    textActive: "text-(--mc-core-purple-3)",
    subtleHover: "hover:bg-(--mc-core-purple-1)",
    subtleActive: "active:bg-(--mc-core-purple-2)",
  },
  Default: {
    base: "bg-(--mc-core-off-black)",
    hover: "hover:bg-(--mc-core-grey-4)",
    active: "active:bg-(--mc-core-grey-6)",
    borderTop: "border-t-(--mc-core-grey-3)",
    borderBottom: "border-b-(--mc-core-off-black)",
    text: "text-(--mc-core-white)",
    textActive: "text-(--mc-core-white)",
    subtleHover: "hover:bg-(--mc-core-grey-1)",
    subtleActive: "active:bg-(--mc-core-grey-2)",
  },
}

const variantStyles: Record<NonNullable<IButtonProps['variant']>, (c: ColorTokens, isActive?: boolean) => string> = {
  Solid: (c) => clsx("ring-2 text-(--mc-core-white) disabled:text-(--mc-core-grey-3)! disabled:bg-(--mc-core-grey-1) disabled:border-t-(--mc-core-grey-3) disabled:border-b-(--mc-core-grey-3)", c.base, c.hover, c.active, c.borderTop, c.borderBottom),

  Outline: (c) => clsx(
    "border-2 bg-transparent ring-2",
    c.text,
    c.subtleHover,
    c.subtleActive
  ),

  Link: (c) => clsx(
    "border-transparent bg-transparent underline-offset-4 hover:underline",
    c.text
  ),

  Ghost: (c, isActive) => clsx(
    "font-bold text-sm border-transparent bg-transparent hover:text-(--mc-core-green-3)",
    isActive ? c.textActive : "text-(--mc-core-white)"
  ),
}

const Button: React.FC<IButtonProps> = ({
  variant = "Solid",
  color = "Default",
  icon,
  isActive,
  children,
  className,
  ...props
}) => {
  const currentColor = colorTokens[color]
  const currentVariant = variantStyles[variant]?.(currentColor, isActive)

  return (
    <button
      className={clsx(
        'cursor-pointer flex items-center gap-2 disabled:cursor-not-allowed text-xl ring-(--mc-core-off-black) drop-shadow-md border-t-8 border-b-8 font-bold py-1 px-12 transition-colors',
        currentVariant,
        className
      )}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  )
}

export default Button