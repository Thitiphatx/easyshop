"use client"
import React from 'react'
import { IButtonProps } from './interface'
import clsx from 'clsx'
import { Reload } from 'pixelarticons/react'

type ColorTokens = {
  base: string
  hover: string
  active: string
  borderTop: string
  borderBottom: string
  text: string
  textActive: string
  subtleHover: string
  subtleActive: string
  ghostHover: string
  retroBase: string
  retroShadow: string
  retroBorder: string
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
    ghostHover: "hover:text-(--core-green-3)",
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
    ghostHover: "hover:text-(--dungeons-red-3)",
    retroBase: "bg-(--dungeons-red-3)",
    retroShadow: "bg-(--dungeons-red-6)",
    retroBorder: "border-(--dungeons-red-2)",
  },
  Gold: {
    base: "bg-(--marketplace-gold-5)",
    hover: "hover:bg-(--marketplace-gold-4)",
    active: "active:bg-(--marketplace-gold-6)",
    borderTop: "border-t-(--marketplace-gold-3)",
    borderBottom: "border-b-(--marketplace-gold-6)",
    text: "text-(--marketplace-gold-3)",
    textActive: "text-(--marketplace-gold-3)",
    subtleHover: "hover:bg-(--marketplace-gold-1)",
    subtleActive: "active:bg-(--marketplace-gold-2)",
    ghostHover: "hover:text-(--marketplace-gold-3)",
    retroBase: "bg-(--marketplace-gold-3)",
    retroShadow: "bg-(--marketplace-gold-6)",
    retroBorder: "border-(--marketplace-gold-2)",
  },
  Blue: {
    base: "bg-(--legends-light-blue-5)",
    hover: "hover:bg-(--legends-light-blue-4)",
    active: "active:bg-(--legends-light-blue-6)",
    borderTop: "border-t-(--legends-light-blue-4)",
    borderBottom: "border-b-(--legends-light-blue-6)",
    text: "text-(--legends-light-blue-3)",
    textActive: "text-(--legends-light-blue-3)",
    subtleHover: "hover:bg-(--legends-light-blue-1)",
    subtleActive: "active:bg-(--legends-light-blue-2)",
    ghostHover: "hover:text-(--legends-light-blue-3)",
    retroBase: "bg-(--legends-light-blue-3)",
    retroShadow: "bg-(--legends-light-blue-6)",
    retroBorder: "border-(--legends-light-blue-2)",
  },
  Purple: {
    base: "bg-(--realms-deep-blue-3)",
    hover: "hover:bg-(--realms-deep-blue-2)",
    active: "active:bg-(--realms-deep-blue-4)",
    borderTop: "border-t-(--realms-deep-blue-2)",
    borderBottom: "border-b-(--realms-deep-blue-4)",
    text: "text-(--realms-deep-blue-2)",
    textActive: "text-(--realms-deep-blue-2)",
    subtleHover: "hover:bg-(--realms-deep-blue-1)",
    subtleActive: "active:bg-(--realms-deep-blue-2)",
    ghostHover: "hover:text-(--realms-deep-blue-2)",
    retroBase: "bg-(--realms-deep-blue-3)",
    retroShadow: "bg-(--realms-deep-blue-6)",
    retroBorder: "border-(--realms-deep-blue-2)",
  },
  Default: {
    base: "bg-(--core-grey-6)",
    hover: "hover:bg-(--core-grey-5)",
    active: "active:bg-(--core-grey-6)",
    borderTop: "border-t-(--core-grey-5)",
    borderBottom: "border-b-(--core-rich-black)",
    text: "text-(--core-off-white)",
    textActive: "text-(--core-white)",
    subtleHover: "hover:bg-(--core-grey-5)",
    subtleActive: "active:bg-(--core-grey-4)",
    ghostHover: "hover:text-(--core-off-white)",
    retroBase: "bg-(--core-grey-2)",
    retroShadow: "bg-(--core-grey-6)",
    retroBorder: "border-(--core-grey-1)",
  },
}

const outlineBorderColor: Record<NonNullable<IButtonProps['color']>, string> = {
  Green: "border-(--core-green-3)",
  Red: "border-(--dungeons-red-3)",
  Gold: "border-(--marketplace-gold-3)",
  Blue: "border-(--legends-light-blue-3)",
  Purple: "border-(--realms-deep-blue-2)",
  Default: "border-(--core-grey-5)",
}

const variantStyles: Record<NonNullable<IButtonProps['variant']>, (c: ColorTokens, color: NonNullable<IButtonProps['color']>, isActive?: boolean) => string> = {
  Solid: (c) => clsx(
    "ring-2 ring-(--core-off-black) border-t-8 border-b-8 py-1 text-(--core-white)",
    "disabled:text-(--core-grey-3)! disabled:bg-(--core-grey-1) disabled:border-t-(--core-grey-3) disabled:border-b-(--core-grey-3)",
    c.base, c.hover, c.active, c.borderTop, c.borderBottom
  ),

  Outline: (c, color) => clsx(
    "border-2 bg-transparent ring-2 ring-(--core-off-black) py-2",
    "disabled:text-(--core-grey-3)! disabled:border-(--core-grey-3)",
    c.text, c.subtleHover, c.subtleActive,
    outlineBorderColor[color],
  ),

  Link: (c) => clsx(
    "border-transparent bg-transparent underline-offset-4 hover:underline py-1",
    "disabled:no-underline disabled:text-(--core-grey-3)!",
    c.text
  ),

  Ghost: (c, _color, isActive) => clsx(
    "font-bold text-sm border-transparent bg-transparent py-1",
    "disabled:text-(--core-grey-3)!",
    isActive ? c.textActive : clsx("text-(--core-white)", c.ghostHover)
  ),

  Retro: (c) => clsx(
    "group rounded-none border-4 border-black p-0 drop-shadow-none transition-all active:translate-y-0",
    "disabled:opacity-50 disabled:pointer-events-none",
    c.retroShadow
  ),
}

const Button: React.FC<IButtonProps> = ({
  variant = "Solid",
  color = "Default",
  icon,
  iconPosition = "start",
  isIconOnly = false,
  isActive,
  isDisabled = false,
  isLoading = false,
  block = false,
  children,
  className,
  ...props
}) => {
  const c = colorTokens[color]
  const variantClass = variantStyles[variant]?.(c, color, isActive)
  const isRetro = variant === "Retro"
  const disabled = isDisabled || isLoading

  const content = isIconOnly ? (
    <div className="flex items-center justify-center">
      {isLoading ? <Reload /> : icon}
    </div>
  ) : (
    <>
      {(isLoading ? iconPosition === 'start' : icon && iconPosition === 'start') && (
        <span className="shrink-0 inline-flex items-center">
          {isLoading && iconPosition === 'start' ? <Reload /> : icon}
        </span>
      )}
      {children}
      {(isLoading ? iconPosition === 'end' : icon && iconPosition === 'end') && (
        <span className="shrink-0 inline-flex items-center ml-auto">
          {isLoading && iconPosition === 'end' ? <Reload /> : icon}
        </span>
      )}
    </>
  )

  return (
    <button
      disabled={disabled}
      className={clsx(
        'relative flex items-center justify-center font-bold text-xl drop-shadow-md transition-colors disabled:cursor-not-allowed cursor-pointer gap-2.5',
        !isRetro && (isIconOnly ? 'px-3 aspect-square' : 'px-6'),
        variantClass,
        block && 'w-full',
        className
      )}
      {...props}
    >
      {isRetro ? (
        <span
          className={clsx(
            'flex w-full h-full items-center justify-center -translate-y-1 border-2 transition-transform group-active:translate-y-0 text-(--core-rich-black) gap-2.5',
            c.retroBorder,
            c.retroBase,
            isIconOnly ? 'p-2 aspect-square' : 'px-6 py-2'
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