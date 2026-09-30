import { createPortal } from 'react-dom'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import Colors from '../../../shared/styles/colors'
import Icon, { type IconName } from '../../ui/icon/Icon'
import { MenuItem, MenuList } from '../Menu'

export interface ContextMenuItem {
  label: string
  icon?: IconName
  onClick: () => void
  disabled?: boolean
}

export interface ContextMenuHandle {
  open: (items: ContextMenuItem[], x: number, y: number) => void
  close: () => void
}

interface ContextMenuProps {
  className?: string
}

interface Position {
  x: number
  y: number
}

export const ContextMenu = forwardRef<ContextMenuHandle, ContextMenuProps>(function ContextMenu({ className }, ref) {
  const [position, setPosition] = useState<Position | null>(null)
  const [items, setItems] = useState<ContextMenuItem[]>([])
  const menuRef = useRef<HTMLUListElement>(null)

  useImperativeHandle(ref, () => ({
    open: (nextItems, x, y) => {
      setItems(nextItems)
      setPosition({ x, y })
    },
    close: () => setPosition(null),
  }), [])

  useEffect(() => {
    if (!position) return
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setPosition(null)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPosition(null)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [position])

  useLayoutEffect(() => {
    if (!position || !menuRef.current) return
    const { width, height } = menuRef.current.getBoundingClientRect()
    menuRef.current.style.left = `${Math.max(0, Math.min(position.x, window.innerWidth - width))}px`
    menuRef.current.style.top = `${Math.max(0, Math.min(position.y, window.innerHeight - height))}px`
  }, [position])

  if (!position) return null
  return createPortal(
    <MenuList ref={menuRef} role="menu" className={`fixed z-50 min-w-40 py-1 animate-fade-in ${className ?? ''}`} style={{ left: position.x, top: position.y }}>
      {items.map((item, index) => (
        <MenuItem key={`${item.label}-${index}`} role="menuitem" disabled={item.disabled} onSelect={() => { item.onClick(); setPosition(null) }}>
          {item.icon && <Icon name={item.icon} size={18} color={item.disabled ? Colors.INPUTICON : Colors.BLACK} />}
          {item.label}
        </MenuItem>
      ))}
    </MenuList>,
    document.body,
  )
})

export default ContextMenu
