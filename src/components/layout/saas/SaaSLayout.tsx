import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import Recent, { type RecentPage } from "../sidebar/recent/Recent.js";
import { SidebarOption } from "../sidebar/Sidebar.reusables.js";
import { SIDEBAR_ICON_SIZE } from "../sidebar/Sidebar.styles.js";
import OrganicLogo from "../../brand/logo/OrganicLogo.js";
import Icon, { type IconName } from "../../ui/icon/Icon.js";
import PageSearch from "../page-search/PageSearch.js";
import SaaSAccount from "./SaaSAccount.js";
import ToolbarAction from "../../ui/button/ToolbarAction.js";

export interface SaaSNavigationItem {
  to: string;
  label: string;
  icon: IconName;
}
export interface SaaSNavigationGroup {
  title: string;
  items: SaaSNavigationItem[];
}
export interface SaaSLayoutLabels {
  openMenu: string;
  closeMenu: string;
  collapseSidebar: string;
  expandSidebar: string;
  search: string;
  signOut: string;
  account: string;
  recent: string;
  noRecent: string;
}
export interface SaaSLayoutProps {
  title: string;
  identity: string;
  groups: SaaSNavigationGroup[];
  children: ReactNode;
  onSignOut: () => void;
  badge?: ReactNode;
  homeTo?: string;
  defaultCollapsed?: boolean;
  labels?: Partial<SaaSLayoutLabels>;
}

const DEFAULT_LABELS: SaaSLayoutLabels = {
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  collapseSidebar: "Recolher menu",
  expandSidebar: "Expandir menu",
  search: "Buscar uma tela",
  signOut: "Sair",
  account: "Conta",
  recent: "Recentes",
  noRecent: "Nenhuma tela recente",
};
const RECENT_LIMIT = 6;

function subscribeDesktop(listener: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

const RECENT_EVENT = "solaria:sidebar-recent";

function subscribeRecent(listener: () => void) {
  window.addEventListener(RECENT_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(RECENT_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function readRecentRaw(key: string): string {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

function parseRecent(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function SaaSLayout({
  title,
  identity,
  groups,
  children,
  onSignOut,
  badge,
  homeTo = "/",
  defaultCollapsed = true,
  labels,
}: SaaSLayoutProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [collapsedState, setCollapsed] = useState(defaultCollapsed);
  const { pathname } = useLocation();
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
  const viewKey = `${pathname}|${desktop}`;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const open = openKey === viewKey;
  const setOpen = (value: boolean) => setOpenKey(value ? viewKey : null);
  const drawer = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const collapsed = desktop && collapsedState;
  const items = groups.flatMap((group) => group.items);
  const recentKey = `solaria.sidebar.recent.${title}`;
  const recentRaw = useSyncExternalStore(subscribeRecent, () => readRecentRaw(recentKey), () => "[]");
  const recent = parseRecent(recentRaw);
  const activePath = items
    .map((item) => item.to)
    .filter((to) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`)))
    .sort((a, b) => b.length - a.length)[0];

  useEffect(() => {
    if (!activePath || activePath === homeTo) return;
    const current = parseRecent(readRecentRaw(recentKey));
    if (current[0] === activePath) return;
    const next = [activePath, ...current.filter((item) => item !== activePath)].slice(0, RECENT_LIMIT);
    try {
      localStorage.setItem(recentKey, JSON.stringify(next));
    } catch {
      // storage unavailable: recents stay in memory only
    }
    window.dispatchEvent(new Event(RECENT_EVENT));
  }, [activePath, homeTo, recentKey]);

  useEffect(() => {
    if (!open || desktop) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      [
        ...(drawer.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        ) ?? []),
      ].filter((item) => item.getClientRects().length > 0);
    focusable()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof Element && event.target.closest('[role="menu"]')) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenKey(null);
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!elements.includes(document.activeElement as HTMLElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open, desktop]);

  const searchItems = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));
  const recentPages: RecentPage[] = recent.flatMap((to) => items.filter((item) => item.to === to));
  const navigationLabel = `Navegação de ${title}`;

  return (
    <div className="operational-shell flex h-dvh flex-col overflow-hidden bg-operational-shell font-ui lg:flex-row">
      <PageSearch items={searchItems} recent={recent} onNavigate={() => setOpen(false)} labels={{ search: text.search, recent: text.recent }} />
      {open && !desktop && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={text.closeMenu}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/20"
        />
      )}
      <div
        id="saas-sidebar"
        ref={drawer}
        role={!desktop && open ? "dialog" : undefined}
        aria-modal={!desktop && open ? true : undefined}
        aria-label={navigationLabel}
        inert={!desktop && !open ? true : undefined}
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-250 ease-in-out motion-reduce:transition-none lg:static ${!desktop && !open ? "pointer-events-none -translate-x-full" : "translate-x-0"}`}>
        <Sidebar
          hideToggle
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          collapseLabel={text.collapseSidebar}
          expandLabel={text.expandSidebar}
          header={
            <>
              <div className={`flex min-h-16 shrink-0 items-center gap-2 px-3 ${collapsed ? "flex-col py-3" : ""}`}>
                <Link to={homeTo} aria-label={title} className="shrink-0">
                  <OrganicLogo width={2.5} holdMs={5000} transitionMs={500} label={title} />
                </Link>
                {!collapsed && <span className="min-w-0 flex-1" />}
                {desktop && (
                  <button
                    type="button"
                    onClick={() => setCollapsed(!collapsedState)}
                    aria-label={collapsed ? text.expandSidebar : text.collapseSidebar}
                    title={collapsed ? text.expandSidebar : text.collapseSidebar}
                    aria-expanded={!collapsed}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-small text-operational-muted hover:bg-sidebar-hover focus-visible:outline-2 focus-visible:outline-operational-ink">
                    <Icon name={collapsed ? "panelLeftOpen" : "panelLeftClose"} size={SIDEBAR_ICON_SIZE} />
                  </button>
                )}
              </div>
              {!desktop && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 w-full items-center gap-2 px-6 text-sidebar hover:bg-sidebar-hover">
                  <Icon name="x" size={SIDEBAR_ICON_SIZE} />
                  {text.closeMenu}
                </button>
              )}
            </>
          }
          navigation={
            <nav
              aria-label={navigationLabel}
              className={`scrollbar-none min-h-0 flex-1 overflow-x-hidden overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
              {groups.map((group, index) => {
                const visible = group.items;
                return visible.length ? (
                  <section key={group.title} className="mt-4 first:mt-2">
                    {collapsed && index > 0 && <div aria-hidden="true" className="mx-3 mb-4 h-px rounded-full bg-operational-border" />}
                    <h2
                      aria-hidden={collapsed}
                      className={`text-sidebar-group font-medium leading-5 text-operational-muted transition-[height,opacity,margin] duration-250 ease-in-out motion-reduce:transition-none ${collapsed ? "mb-0 h-0 overflow-hidden whitespace-nowrap opacity-0" : "mb-1 min-h-5 whitespace-normal px-3 opacity-100"}`}>
                      {group.title}
                    </h2>
                    <ul onClick={() => setOpen(false)} className="flex flex-col gap-1">
                      {visible.map((item) => (
                        <SidebarOption key={item.to} to={item.to} content={item.label} icon={item.icon} />
                      ))}
                    </ul>
                    {index === 0 && !collapsed && (
                      <Recent pages={recentPages} label={text.recent} emptyLabel={text.noRecent} onNavigate={() => setOpen(false)} />
                    )}
                  </section>
                ) : null;
              })}
            </nav>
          }>
          {null}
        </Sidebar>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="navbar-frame justify-between gap-4 bg-operational-shell!">
          <div className="flex min-w-0 items-center gap-3">
            <ToolbarAction
              ref={menuButton}
              icon="menu"
              label={text.openMenu}
              content={text.openMenu}
              aria-controls="saas-sidebar"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="lg:hidden"
            />
            {badge}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SaaSAccount identity={identity} onSignOut={onSignOut} accountLabel={text.account} signOutLabel={text.signOut} />
          </div>
        </header>
        <div
          id="saas-content"
          key={pathname}
          className="mb-2 mr-2 min-h-0 min-w-0 flex-1 overflow-y-auto rounded-hard bg-operational-surface scrollbar-none sm:mb-4 sm:mr-4">
          {children}
        </div>
      </div>
    </div>
  );
}
