import { useContext } from "react";
import { ContextMenuContext, type ContextMenuContextValue } from "./ContextMenuContext.js";


export function useContextMenu(): ContextMenuContextValue {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("useContextMenu: deve ser usado dentro de um ContextMenuProvider.");

  return context;
}
