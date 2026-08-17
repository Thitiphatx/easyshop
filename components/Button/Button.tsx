"use client"
import React from 'react'
import { IButtonProps } from './interface'
import clsx from 'clsx'

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
  // --- Retro Tokens ---
  retroBase: string    // สีหน้าปุ่มส่วนบน
  retroShadow: string  // สีขอบล่าง/เงา
  retroBorder: string  // สีกรอบขอบในหน้าปุ่ม
}

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
    retroBase: "bg-(--core-green-3)",
    retroShadow: "bg-(--core-green-5)",
    retroBorder: "border-(--core-green-2)",
  },
  Red: {
    base: "bg-(--dungeons-red-5)",
    hover: "hover:bg-(--dungeons-red-4)",
    active: "active:bg-(--dungeons-red-6)",
    borderTop: "border-t-(--dungeons-red-3)",
    borderBottom: "border-b-(--dungeons-red-6)",
    text: "text-(--dungeons-red-3)",
    textActive: "text-(--dungeons-red-3)",
    subtleHover: "hover:bg-(--dungeons-red-1)",
    subtleActive: "active:bg-(--dungeons-red-2)",
    retroBase: "bg-(--dungeons-red-3)",
    retroShadow: "bg-(--dungeons-red-6)",
    retroBorder: "border-(--dungeons-red-2)",
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
    retroBase: "bg-amber-400",
    retroShadow: "bg-amber-800",
    retroBorder: "border-amber-300",
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
    retroBase: "bg-[#88CBEB]",
    retroShadow: "bg-[#6B8EBF]",
    retroBorder: "border-[#00A3E0]",
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
    retroBase: "bg-purple-400",
    retroShadow: "bg-purple-800",
    retroBorder: "border-purple-300",
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
    retroBase: "bg-gray-300",
    retroShadow: "bg-gray-600",
    retroBorder: "border-gray-100",
  },
}

const variantStyles: Record<NonNullable<IButtonProps['variant']>, (c: ColorTokens, isActive?: boolean) => string> = {
  Solid: (c) => clsx("ring-2 ring-(--core-off-black) border-t-8 border-b-8 py-1 text-(--core-white) disabled:text-(--core-grey-3)! disabled:bg-(--core-grey-1) disabled:border-t-(--core-grey-3) disabled:border-b-(--core-grey-3)", c.base, c.hover, c.active, c.borderTop, c.borderBottom),

  Outline: (c) => clsx(
    "border-2 bg-transparent ring-2 ring-(--core-off-black) border-t-8 border-b-8 py-1",
    c.text,
    c.subtleHover,
    c.subtleActive
  ),

  Link: (c) => clsx(
    "border-transparent bg-transparent underline-offset-4 hover:underline py-1",
    c.text
  ),

  Ghost: (c, isActive) => clsx(
    "font-bold text-sm border-transparent bg-transparent hover:text-(--core-green-3) py-1",
    isActive ? c.textActive : "text-(--core-white)"
  ),

  Retro: (c) => clsx(
    "group rounded-none border-4 border-black p-0 drop-shadow-none transition-all active:translate-y-0",
    c.retroShadow
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
  const isRetro = variant === "Retro"

  // Render เนื้อหาด้านในปุ่ม (Icon + Children)
  const content = isIconOnly ? (
    <div className="flex items-center justify-center">{icon}</div>
  ) : (
    <>
      {icon && iconPosition === 'start' && (
        <div className="mx-4 absolute left-0 flex items-center">{icon}</div>
      )}
      {children}
      {icon && iconPosition === 'end' && (
        <div className="mx-4 absolute right-0 flex items-center">{icon}</div>
      )}
    </>
  )

  return (
    <button
      className={clsx(
        'relative flex items-center justify-center font-bold text-xl drop-shadow-md transition-colors disabled:cursor-not-allowed cursor-pointer',
        !isRetro && (isIconOnly ? 'px-2 aspect-square' : 'px-12 gap-2'),
        currentVariant,
        block && 'w-full px-0!',
        className
      )}
      {...props}
    >
      {isRetro ? (
        <span
          className={clsx(
            'flex w-full h-full items-center justify-center -translate-y-1 border-2 transition-transform group-active:translate-y-0 text-(--core-rich-black)',
            currentColor.retroBorder,
            currentColor.retroBase,
            isIconOnly ? 'p-3 aspect-square' : 'px-12 py-3 gap-2'
          )}
        >
          {content}
        </span>
      ) : (
        content
      )}
    </button>
  )
}

export default Button