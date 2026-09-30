import { useContext } from 'react'
import { ContextMenuContext, type ContextMenuContextValue } from './context'

export function useContextMenu(): ContextMenuContextValue {
  const context = useContext(ContextMenuContext)
  if (!context) throw new Error('useContextMenu must be used within a ContextMenuProvider')
  return context
}

export default useContextMenu
