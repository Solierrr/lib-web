import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "../icon/Icon.js";

export interface LinkShareLabels {
  copy: string;
  copied: string;
  failed: string;
  unavailable: string;
}

export interface LinkShareProps {
  label: string;
  href?: string;
  context?: string;
  icon?: ReactNode;
  tag?: string;
  labels?: Partial<LinkShareLabels>;
  className?: string;
}

const DEFAULT_LABELS: LinkShareLabels = {
  copy: "Copiar link",
  copied: "Link copiado",
  failed: "Não foi possível copiar",
  unavailable: "Não configurado",
};
const FEEDBACK_MS = 2000;

export default function LinkShare({ label, href, context, icon, tag, labels, className = "" }: LinkShareProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const subject = context ? `${context} ${label}` : label;
  const compact = icon !== undefined;
  const height = compact ? "h-8" : "h-9";
  const content = compact ? (
    <>
      {icon}
      {tag && <span className="text-xs font-medium">{tag}</span>}
    </>
  ) : (
    <>
      {label}
      <Icon name="externalLink" size={14} className="shrink-0" />
    </>
  );

  if (!href) {
    return (
      <span
        title={`${subject}: ${text.unavailable}`}
        className={`inline-flex ${height} items-center gap-1.5 rounded-small bg-input-bg px-2.5 text-body text-input-text opacity-60 ${className}`}>
        {compact ? (
          <>
            <span aria-hidden="true" className="inline-flex grayscale">
              {icon}
            </span>
            {tag && (
              <span aria-hidden="true" className="text-xs font-medium">
                {tag}
              </span>
            )}
          </>
        ) : (
          label
        )}
        <span className="sr-only">
          {subject}: {text.unavailable}
        </span>
      </span>
    );
  }

  async function copy() {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(href ?? "");
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = window.setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  }

  return (
    <span className={`inline-flex items-center overflow-hidden rounded-small bg-input-bg ${className}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${subject} (abre em nova aba)`}
        title={subject}
        className={`inline-flex ${height} items-center gap-1.5 px-2.5 text-body font-medium text-operational-ink hover:bg-sidebar-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-operational-ink`}>
        {content}
      </a>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={`${text.copy}: ${subject}`}
        title={text.copy}
        className={`flex ${height} w-8 cursor-pointer items-center justify-center border-l border-operational-border text-operational-ink hover:bg-sidebar-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-operational-ink`}>
        <Icon name={status === "copied" ? "check" : "copy"} size={15} className="shrink-0" />
      </button>
      <span role="status" className={status === "idle" ? "sr-only" : "px-2 text-xs text-operational-muted"}>
        {status === "copied" ? text.copied : status === "failed" ? text.failed : ""}
      </span>
    </span>
  );
}
