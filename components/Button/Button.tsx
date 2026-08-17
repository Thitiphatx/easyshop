"use client"
import React from 'react'
import { IButtonProps } from './interface'
import clsx from 'clsx'
import { Check } from 'pixelarticons/react'

type ColorTokens = {
  base: string         // main background shade
  hover: string        // background on hover (solid variant)
  active: string       // background on active/press (solid variant)
  borderTop: string    // top border accent (solid variant, lighter)
  borderBottom: string // bottom border accent (solid variant, darker)
  text: string         // text/border color for outline & link variants
  textActive: string   // text color when active (ghost variant)
  subtleHover: string  // faint bg on hover (outline variant)
  subtleActive: string // faint bg on active (outline variant)
}

// 1. Color Tokens — color data ONLY, no layout/structure decisions
const colorTokens: Record<NonNullable<IButtonProps['color']>, ColorTokens> = {
  Green: {
    base: "bg-(--core-green-5)",
    hover: "hover:bg-(--core-green-4)",
    active: "active:bg-(--core-green-6)",
    borderTop: "border-t-(--core-green-3)",
    borderBottom: "border-b-(--core-green-6)",
    text: "text-(--core-green-3)",
    textActive: "text-(--core-green-3)",
    subtleHover: "hover:bg-(--core-green-1)",
    subtleActive: "active:bg-(--core-green-2)",
  },
  Gold: {
    base: "bg-(--core-gold-5)",
    hover: "hover:bg-(--core-gold-4)",
    active: "active:bg-(--core-gold-6)",
    borderTop: "border-t-(--core-gold-3)",
    borderBottom: "border-b-(--core-gold-6)",
    text: "text-(--core-gold-3)",
    textActive: "text-(--core-gold-3)",
    subtleHover: "hover:bg-(--core-gold-1)",
    subtleActive: "active:bg-(--core-gold-2)",
  },
  Blue: {
    base: "bg-(--core-blue-5)",
    hover: "hover:bg-(--core-blue-4)",
    active: "active:bg-(--core-blue-6)",
    borderTop: "border-t-(--core-blue-3)",
    borderBottom: "border-b-(--core-blue-6)",
    text: "text-(--core-blue-3)",
    textActive: "text-(--core-blue-3)",
    subtleHover: "hover:bg-(--core-blue-1)",
    subtleActive: "active:bg-(--core-blue-2)",
  },
  Purple: {
    base: "bg-(--core-purple-5)",
    hover: "hover:bg-(--core-purple-4)",
    active: "active:bg-(--core-purple-6)",
    borderTop: "border-t-(--core-purple-3)",
    borderBottom: "border-b-(--core-purple-6)",
    text: "text-(--core-purple-3)",
    textActive: "text-(--core-purple-3)",
    subtleHover: "hover:bg-(--core-purple-1)",
    subtleActive: "active:bg-(--core-purple-2)",
  },
  Default: {
    base: "bg-(--core-grey-6)",
    hover: "hover:bg-(--core-grey-5)",
    active: "active:bg-(--core-grey-6)",
    borderTop: "border-t-(--core-grey-5)",
    borderBottom: "border-b-(--core-rich-black)",
    text: "text-(--core-off-white)",
    textActive: "text-(--core-white)",
    subtleHover: "hover:bg-(--core-grey-1)",
    subtleActive: "active:bg-(--core-grey-2)",
  },
}

const variantStyles: Record<NonNullable<IButtonProps['variant']>, (c: ColorTokens, isActive?: boolean) => string> = {
  Solid: (c) => clsx("ring-2 text-(--core-white) disabled:text-(--core-grey-3)! disabled:bg-(--core-grey-1) disabled:border-t-(--core-grey-3) disabled:border-b-(--core-grey-3)", c.base, c.hover, c.active, c.borderTop, c.borderBottom),

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
    "font-bold text-sm border-transparent bg-transparent hover:text-(--core-green-3)",
    isActive ? c.textActive : "text-(--core-white)"
  ),
}

const Button: React.FC<IButtonProps> = ({
  variant = "Solid",
  color = "Default",
  icon,
  iconPosition = "start",
  isIconOnly = false,
  block = false,
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
        'relative flex items-center justify-center font-bold text-xl drop-shadow-md border-t-8 border-b-8 py-1 transition-colors disabled:cursor-not-allowed cursor-pointer',
        'ring-(--core-off-black)',
        isIconOnly ? 'px-2 aspect-square' : 'px-12 gap-2',
        currentVariant,
        block && 'w-full px-0!',
        className
      )}
      {...props}
    >
      {isIconOnly ? (
        // กรณี isIconOnly: วางไอคอนตรงกลางตัวเดียว ไม่สน iconPosition และไม่แสดง children
        <div className="flex items-center justify-center">{icon}</div>
      ) : (
        // กรณีปกติ: มีข้อความและไอคอนตาม iconPosition
        <>
          {icon && iconPosition === 'start' && (
            <div className="mx-4 absolute left-0 flex items-center">
              {icon}
            </div>
          )}

          {children}

          {icon && iconPosition === 'end' && (
            <div className="mx-4 absolute right-0 flex items-center">
              {icon}
            </div>
          )}
        </>
      )}
    </button>
  )
}

export default Button