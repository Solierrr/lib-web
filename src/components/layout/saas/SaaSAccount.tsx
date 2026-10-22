import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import ToolbarAction from "../../ui/button/ToolbarAction.js";
import { SIDEBAR_ICON_SIZE } from "../sidebar/Sidebar.styles.js";
import { ContextMenu, type ContextMenuHandle } from "../../overlay/contextMenu/ContextMenu.js";

export interface SaaSAccountProps {
  identity: string;
  onSignOut: () => void;
  accountLabel?: string;
  signOutLabel?: string;
  header?: ReactNode;
}

export default function SaaSAccount({ identity, onSignOut, accountLabel = "Conta", signOutLabel = "Sair", header }: SaaSAccountProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<ContextMenuHandle>(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  return (
    <>
      <ToolbarAction
        ref={trigger}
        icon="account"
        iconSize={SIDEBAR_ICON_SIZE}
        iconMotion="account"
        label={accountLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          if (open) {
            menu.current?.close();
            return;
          }
          const bounds = trigger.current?.getBoundingClientRect();
          if (!bounds) return;
          setOpen(true);
          menu.current?.open([{ label: signOutLabel, icon: "logout", onClick: onSignOut }], bounds.right, bounds.bottom);
        }}
      />
      <ContextMenu
        ref={menu}
        id={id}
        label={accountLabel}
        autoFocus
        triggerRef={trigger}
        align="end"
        onClose={close}
        className="max-w-[calc(100vw-2rem)]"
        header={
          <div className="flex flex-col gap-1">
            <p className="break-all text-body">{identity}</p>
            {header}
          </div>
        }
      />
    </>
  );
}
