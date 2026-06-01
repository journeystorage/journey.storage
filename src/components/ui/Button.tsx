'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  onDark?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', onDark = false, className = '', children, disabled, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'rounded-xl',
      'text-body font-bold',
      'min-h-[44px]',
      'px-7 py-3.5',
      'transition-all duration-200 ease-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    ].join(' ')

    const variants: Record<ButtonVariant, string> = {
      primary: [
        'bg-orange text-warm-white border-none shadow-[0_2px_8px_rgba(232,98,42,0.3)]',
        !disabled && 'hover:brightness-[1.1] hover:shadow-[0_4px_16px_rgba(232,98,42,0.4)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_2px_8px_rgba(232,98,42,0.3)]',
      ]
        .filter(Boolean)
        .join(' '),

      secondary: [
        'bg-transparent',
        onDark
          ? 'text-warm-white border border-warm-white/40'
          : 'text-black border border-black/20',
        !disabled &&
          (onDark
            ? 'hover:bg-warm-white/10 hover:border-warm-white/60'
            : 'hover:bg-black/5 hover:border-black/40'),
      ]
        .filter(Boolean)
        .join(' '),

      ghost: [
        'bg-transparent text-stone border-none',
        !disabled && 'hover:text-orange',
      ]
        .filter(Boolean)
        .join(' '),
    }

    const showArrow = variant === 'secondary' || variant === 'ghost'

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
        {showArrow && <span aria-hidden="true">→</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
