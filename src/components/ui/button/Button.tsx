import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Colors from '../../../shared/styles/colors'
import Icon, { type IconName } from '../icon/Icon'

export interface ButtonIconProps {
  name: IconName
  inverse?: boolean
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content?: string
  icon?: ButtonIconProps
  txtColor?: string
  bgColor?: string
  description?: string
  rounded?: boolean
  action?: () => void | Promise<void>
  children?: ReactNode
}

export function Button({
  content,
  children,
  icon,
  title,
  description,
  rounded = false,
  disabled = false,
  bgColor = Colors.ORANGE,
  txtColor = Colors.WHITE,
  className,
  action,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const label = children ?? content
  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!action) return

    setIsLoading(true)
    try {
      await action()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      {...props}
      type={type}
      className={`solierrr-button relative inline-flex items-center justify-center gap-2 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${rounded ? 'rounded-full' : 'rounded-medium'} ${className ?? ''}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={title}
      aria-label={description ?? title ?? (typeof label === 'string' ? label : undefined)}
      aria-busy={isLoading}
      style={{ backgroundColor: bgColor, color: txtColor, ...props.style }}>
      {icon && <Icon name={icon.name} color={txtColor} />}
      {label}
      {isLoading && <Icon name="loader" color={txtColor} className="animate-spin" aria-hidden="true" />}
    </button>
  )
}

export default Button
