import { useMemo, useRef } from "react";
import { ContextMenu, type ContextMenuHandle } from "../ContextMenu.js";
import { ContextMenuContext, type ContextMenuContextValue } from "../ContextMenuContext.js";

export interface ContextMenuProviderProps {
  children: React.ReactNode;
}


export function ContextMenuProvider({ children }: ContextMenuProviderProps) {
  const menuRef = useRef<ContextMenuHandle>(null);

  const value = useMemo<ContextMenuContextValue>(
    () => ({
      open: (items, x, y) => menuRef.current?.open(items, x, y),
      close: () => menuRef.current?.close(),
    }),
    [],
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      <ContextMenu ref={menuRef} />
    </ContextMenuContext.Provider>
  );
}
