import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

export function Button({
  variant = 'primary',
  size = 'medium',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['solierrr-button', `solierrr-button--${variant}`, `solierrr-button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return <button {...props} className={classes} type={type} />
}
