import { useCallback, useId, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon, { type IconName } from "../../../ui/icon/Icon.js";
import { ContextMenu, type ContextMenuHandle } from "../../../overlay/contextMenu/ContextMenu.js";
import { SIDEBAR_ICON_SIZE, sidebarItemClass } from "../Sidebar.styles.js";

export interface RecentPage {
  to: string;
  label: string;
  icon: IconName;
}

export interface RecentProps {
  pages: RecentPage[];
  label?: string;
  emptyLabel?: string;
  onNavigate?: () => void;
}

export default function Recent({ pages, label = "Recentes", emptyLabel = "Nenhuma tela recente", onNavigate }: RecentProps) {
  const navigate = useNavigate();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<ContextMenuHandle>(null);
  const id = useId();
  const close = useCallback(() => trigger.current?.focus(), []);

  function toggle() {
    const bounds = trigger.current?.getBoundingClientRect();
    if (!bounds) return;
    menu.current?.open(
      pages.length
        ? pages.map((page) => ({
            label: page.label,
            icon: page.icon,
            onClick: () => {
              navigate(page.to);
              onNavigate?.();
            },
          }))
        : [{ label: emptyLabel, disabled: true, onClick: () => undefined }],
      bounds.right + 8,
      bounds.top,
    );
  }

  return (
    <div className="mt-2">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-controls={id}
        onClick={toggle}
        className={`${sidebarItemClass(false)} w-full text-operational-ink hover:bg-sidebar-hover`}>
        <Icon name="history" size={SIDEBAR_ICON_SIZE} className="shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        <Icon name="chevronRight" size={SIDEBAR_ICON_SIZE} className="shrink-0" />
      </button>
      <ContextMenu ref={menu} id={id} label={label} autoFocus triggerRef={trigger} onClose={close} className="max-w-[calc(100vw-2rem)]" />
    </div>
  );
}
