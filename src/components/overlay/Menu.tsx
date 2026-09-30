import { forwardRef, type HTMLAttributes, type LiHTMLAttributes } from 'react'

export type MenuListProps = HTMLAttributes<HTMLUListElement>

export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(function MenuList({ className, children, ...props }, ref) {
  return <ul ref={ref} {...props} className={`overflow-hidden rounded-medium bg-white shadow-lg ${className ?? ''}`}>{children}</ul>
})

export interface MenuItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  onSelect?: () => void
  disabled?: boolean
  selected?: boolean
}

export function MenuItem({ onSelect, disabled = false, selected, className, onKeyDown, children, ...props }: MenuItemProps) {
  function activate() {
    if (!disabled) onSelect?.()
  }

  return (
    <li
      {...props}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-selected={selected}
      className={`flex items-center gap-2 px-4 py-2 font-medium select-none focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-input-bg focus:bg-input-bg'} ${selected ? 'bg-input-bg' : ''} ${className ?? ''}`}
      onClick={activate}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activate()
        }
      }}>
      {children}
    </li>
  )
}
