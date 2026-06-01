'use client'

import { forwardRef, type InputHTMLAttributes, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Renders on a dark background */
  onDark?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, onDark = false, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const id = externalId ?? generatedId
    const errorId = `${id}-error`

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className={`text-body-sm font-bold ${onDark ? 'text-warm-white' : 'text-black'}`}
        >
          {label}
          {props.required && (
            <span className="text-orange ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          aria-required={props.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            'w-full rounded-sm px-4 py-3.5',
            'text-body font-normal',
            'placeholder:text-stone',
            'transition-colors duration-150 ease-out',
            'focus-visible:outline-none focus-visible:ring-0',
            onDark
              ? 'bg-white/[0.06] text-warm-white'
              : 'bg-white text-black',
            error
              ? 'border border-[#D94A4A] focus:border-[#D94A4A]'
              : 'border border-stone/30 focus:border-orange',
            className,
          ].join(' ')}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-caption text-[#D94A4A]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
