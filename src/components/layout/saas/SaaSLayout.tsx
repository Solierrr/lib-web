import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import { SidebarOption } from "../sidebar/Sidebar.reusables.js";
import Logo from "../../brand/logo/Logo.js";
import Input from "../../ui/input/Input.js";
import { WhiteButton } from "../../ui/button/Button.presets.js";
import type { IconName } from "../../ui/icon/Icon.js";

export interface SaaSNavigationItem {
  to: string;
  label: string;
  icon: IconName;
}
export interface SaaSNavigationGroup {
  title: string;
  items: SaaSNavigationItem[];
}
export interface SaaSLayoutProps {
  title: string;
  identity: string;
  groups: SaaSNavigationGroup[];
  children: ReactNode;
  onSignOut: () => void;
  badge?: ReactNode;
}

export default function SaaSLayout({
  title,
  identity,
  groups,
  children,
  onSignOut,
  badge,
}: SaaSLayoutProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const drawer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 1024px)").matches) return;
    const previous = document.activeElement as HTMLElement | null;
    const element = drawer.current;
    const focusable = () =>
      [
        ...(element?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        ) || []),
      ].filter((item) => item.getClientRects().length > 0);
    focusable()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const target = event.shiftKey ? items[items.length - 1] : items[0];
      if (
        !items.includes(document.activeElement as HTMLElement) ||
        (event.shiftKey && document.activeElement === items[0]) ||
        (!event.shiftKey && document.activeElement === items[items.length - 1])
      ) {
        event.preventDefault();
        target?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);
  return (
    <div className="flex h-dvh flex-col bg-operational-surface font-ui text-black">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-operational-border bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <WhiteButton
            description="Abrir menu"
            icon={{ name: "menu" }}
            action={() => setOpen(!open)}
            className="lg:hidden"
          />
          <Link to="/" aria-label={title}>
            <Logo width={2} />
          </Link>
          <span className="font-semi-bold">{title}</span>
          {badge}
        </div>
        <span
          className="max-w-40 truncate text-body text-gray sm:max-w-80"
          title={identity}
        >
          {identity}
        </span>
      </header>
      <div className="relative flex min-h-0 flex-1">
        {open && (
          <button
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-30 bg-black/20 lg:hidden"
          />
        )}
        <div
          ref={drawer}
          role={open ? "dialog" : undefined}
          aria-modal={open || undefined}
          aria-label={`Navegação de ${title}`}
          className={`${open ? "flex" : "hidden"} absolute inset-y-0 left-0 z-40 lg:static lg:flex`}
        >
          <Sidebar
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={
              !collapsed && (
                <div className="p-3">
                  <Input
                    name="navigation-search"
                    placeholder="Buscar uma tela"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    icon={{ name: "search" }}
                  />
                </div>
              )
            }
            footer={
              <div className="p-2">
                <WhiteButton
                  description="Sair"
                  content={collapsed ? undefined : "Sair"}
                  icon={{ name: "logout" }}
                  action={onSignOut}
                  className="w-full"
                />
              </div>
            }
          >
            {groups.map((group) => {
              const items = group.items.filter((item) =>
                item.label.toLowerCase().includes(query.toLowerCase()),
              );
              return items.length ? (
                <li key={group.title} className="list-none">
                  {!collapsed && (
                    <p className="mb-2 mt-4 text-body font-semi-bold uppercase text-gray">
                      {group.title}
                    </p>
                  )}
                  <ul
                    onClick={() => setOpen(false)}
                    className="flex flex-col gap-1"
                  >
                    {items.map((item) => (
                      <SidebarOption
                        key={item.to}
                        to={item.to}
                        content={item.label}
                        icon={item.icon}
                      />
                    ))}
                  </ul>
                </li>
              ) : null;
            })}
          </Sidebar>
        </div>
        <div
          key={pathname}
          className="min-w-0 flex-1 overflow-y-auto scrollbar-none"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
