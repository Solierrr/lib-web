import type { InputHTMLAttributes } from 'react'
import Colors from '../../../shared/styles/colors'
import Icon, { type IconName } from '../icon/Icon'

export interface InputIconProps {
  name: IconName
  inverse?: boolean
  onClick?: () => void
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  rounded?: boolean
  icon?: InputIconProps
}

export function Input({ name, placeholder, icon, rounded = false, className, ...props }: InputProps) {
  const inverse = icon?.inverse ?? false
  const iconElement = icon && (icon.onClick ? (
    <button type="button" onClick={icon.onClick} className={`flex cursor-pointer ${inverse ? 'ml-2' : 'mr-4'}`} aria-label={icon.name}>
      <Icon name={icon.name} color={Colors.INPUTICON} />
    </button>
  ) : <Icon className={`${inverse ? 'ml-2' : 'mr-4'}`} name={icon.name} color={Colors.INPUTICON} />)

  return (
    <div className={`flex w-fit flex-row items-center ${rounded ? 'rounded-full' : 'rounded-medium'} bg-input-bg ${className ?? ''}`}>
      {inverse && iconElement}
      <input
        className={`${icon ? (inverse ? 'pr-4 pl-2' : 'pr-2 pl-4') : 'px-4'} w-full py-2 font-medium text-black placeholder:text-input-text placeholder:select-none focus:outline-0`}
        {...props}
        placeholder={placeholder}
        aria-label={name}
        name={name}
      />
      {!inverse && iconElement}
    </div>
  )
}

export default Input
