import { createContext, useContext } from 'react'

export const SidebarContext = createContext(false)
export function useSidebarCollapsed(): boolean {
  return useContext(SidebarContext)
}
