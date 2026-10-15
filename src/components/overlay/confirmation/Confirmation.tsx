import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PrimaryButton, WhiteButton } from "../../ui/button/Button.presets.js";

export default function Confirmation({
  title,
  message,
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation("commons");
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    return () => {
      document.body.style.overflow = overflow;
      dialog.close?.();
      previous?.focus();
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`}
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md rounded-hard border border-operational-border bg-white p-6 text-operational-ink shadow-lg backdrop:bg-black/30">
      <h2 id={`${id}-title`} className="text-operational-title font-semi-bold leading-8">
        {title}
      </h2>
      <p id={`${id}-message`} className="mt-3 text-operational-muted leading-6">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <WhiteButton
          autoFocus
          content={t("actions.cancel")}
          description={t("actions.cancel")}
          onClick={onCancel}
          disabled={busy}
          className="min-h-10"
        />
        <PrimaryButton content={t("actions.confirm")} description={t("actions.confirm")} onClick={onConfirm} disabled={busy} className="min-h-10" />
      </div>
    </dialog>,
    document.body,
  );
}
