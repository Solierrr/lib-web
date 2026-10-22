import { Fragment, useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input.js";
import Icon, { type IconName } from "../../ui/icon/Icon.js";
import Instructions from "../../ui/instructions/Instructions.js";

export interface PageSearchItem {
  to: string;
  label: string;
  group: string;
  icon: IconName;
}

export interface PageSearchLabels {
  search: string;
  recent: string;
  shortcuts: string;
  noResults: string;
  navigate: string;
  select: string;
}

export interface PageSearchProps {
  items: PageSearchItem[];
  recent?: string[];
  onNavigate?: () => void;
  labels?: Partial<PageSearchLabels>;
}

const DEFAULT_LABELS: PageSearchLabels = {
  search: "Buscar uma tela",
  recent: "Recentes",
  shortcuts: "Atalhos",
  noResults: "Nenhuma tela encontrada.",
  navigate: "navegar",
  select: "abrir",
};

export default function PageSearch({ items, recent: recentTo = [], onNavigate, labels }: PageSearchProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const navigate = useNavigate();
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState({ left: 16, top: 80, width: 640, height: 420 });
  const recent = recentTo.flatMap((to) => items.filter((item) => item.to === to));
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? items.filter((item) => item.label.toLowerCase().includes(normalized))
    : [...recent, ...items.filter((item) => !recentTo.includes(item.to))];
  const active = Math.min(selected, Math.max(0, results.length - 1));

  function place() {
    const width = Math.min(640, window.innerWidth - 32);
    const top = 80;
    setPosition({
      left: Math.max(16, (window.innerWidth - width) / 2),
      top,
      width,
      height: Math.max(140, Math.min(440, window.innerHeight - top - 16)),
    });
  }

  function show() {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    place();
    setQuery("");
    setSelected(0);
    setOpen(true);
  }

  function restoreFocus() {
    requestAnimationFrame(() => {
      const target = returnFocus.current;
      if (target && target !== document.body && target.isConnected && !target.closest("[inert]")) target.focus();
    });
  }

  function close(restore = false) {
    setOpen(false);
    if (restore) restoreFocus();
  }

  const openFromShortcut = useEffectEvent(() => {
    if (open) close(true);
    else show();
  });
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openFromShortcut();
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector("input")?.focus();
    function outside(event: PointerEvent) {
      if (!panel.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      restoreFocus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (open) panel.current?.querySelector('[role="option"][aria-selected="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [active, open, query]);

  function select(index: number) {
    const item = results[index];
    if (!item) return;
    navigate(item.to);
    onNavigate?.();
    close(true);
  }

  if (!open) return null;
  return createPortal(
    <div
      ref={panel}
      className="fixed z-50 flex flex-col gap-2 rounded-hard bg-white p-2 shadow-lg"
      style={{ left: position.left, top: position.top, width: position.width, maxHeight: position.height }}>
      <div className="flex shrink-0 items-center gap-2 rounded-medium bg-input-bg px-3">
        <Icon name="search" size={20} color="var(--color-operational-muted)" />
        <Input
          name={text.search}
          placeholder={text.search}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-results`}
          aria-autocomplete="list"
          aria-activedescendant={results.length ? `${id}-result-${active}` : undefined}
          className="w-full! bg-transparent! [&_input]:px-0 [&_input]:text-body"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (results.length) setSelected((active + (event.key === "ArrowDown" ? 1 : results.length - 1)) % results.length);
            } else if (event.key === "Enter") {
              event.preventDefault();
              select(active);
            }
          }}
        />
        <Instructions items={["Ctrl", "K"]} className="shrink-0" />
      </div>
      <ul id={`${id}-results`} role="listbox" aria-label={text.shortcuts} className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
        {results.map((item, index) => (
          <Fragment key={item.to}>
            {!normalized && (index === 0 || index === recent.length) && (
              <li role="presentation" className="px-3 pb-1 pt-2 text-body text-operational-muted">
                {index === 0 && recent.length ? text.recent : text.shortcuts}
              </li>
            )}
            <li
              id={`${id}-result-${index}`}
              role="option"
              aria-selected={active === index}
              onPointerMove={() => setSelected(index)}
              onClick={() => select(index)}
              className={`flex cursor-pointer items-center gap-3 rounded-medium px-3 py-3 ${active === index ? "bg-operational-hover" : ""}`}>
              <Icon name={!normalized && recentTo.includes(item.to) ? "history" : item.icon} size={18} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate text-body">
                {item.label} <span className="text-body text-operational-muted">— {item.group}</span>
              </span>
            </li>
          </Fragment>
        ))}
      </ul>
      {results.length === 0 && (
        <p role="status" className="p-3 text-body text-operational-muted">
          {text.noResults}
        </p>
      )}
      <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-medium bg-operational-surface p-2">
        <Instructions items={["↑", "↓"]} />
        <span className="text-body text-operational-muted">{text.navigate}</span>
        <Instructions items={["Enter"]} />
        <span className="text-body text-operational-muted">{text.select}</span>
      </div>
    </div>,
    document.body,
  );
}
