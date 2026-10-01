import { useMemo, useRef, type ReactNode } from 'react'
import ContextMenu, { type ContextMenuHandle } from '../ContextMenu'
import { ContextMenuContext, type ContextMenuContextValue } from '../context'

export interface ContextMenuProviderProps {
  children: ReactNode
}

export function ContextMenuProvider({ children }: ContextMenuProviderProps) {
  const menuRef = useRef<ContextMenuHandle>(null)
  const value = useMemo<ContextMenuContextValue>(() => ({
    open: (items, x, y) => menuRef.current?.open(items, x, y),
    close: () => menuRef.current?.close(),
  }), [])

  return <ContextMenuContext.Provider value={value}>{children}<ContextMenu ref={menuRef} /></ContextMenuContext.Provider>
}

export default ContextMenuProvider
