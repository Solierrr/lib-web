import { useTranslation } from "react-i18next";
import ToolbarAction from "../button/ToolbarAction.js";

export interface PaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, total, pageSize = 5, onPageChange }: PaginationProps) {
  const { t } = useTranslation("commons", { keyPrefix: "pagination" });
  const size = Math.max(1, pageSize);
  const last = Math.max(1, Math.ceil(total / size));
  const current = Math.max(1, Math.min(page, last));
  const start = total ? (current - 1) * size + 1 : 0;
  const end = Math.min(current * size, total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-body">
      <p role="status" aria-live="polite" className="text-operational-muted">
        {t("summary", { start, end, total })}
      </p>
      <nav
        aria-label={t("label")}
        className="inline-flex overflow-hidden rounded-medium border border-operational-border [&>*+*]:border-l [&>*+*]:border-operational-border">
        <ToolbarAction
          icon="chevronsLeft"
          label={t("first")}
          disabled={current === 1}
          onClick={() => onPageChange(1)}
          className="h-10! w-10! rounded-none!"
        />
        <ToolbarAction
          icon="chevronLeft"
          label={t("previous")}
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className="h-10! w-10! rounded-none!"
        />
        <ToolbarAction
          label={t("page", { page: current })}
          content={String(current)}
          aria-current="page"
          className="h-10! min-w-12! rounded-none! bg-operational-surface!"
        />
        <ToolbarAction
          icon="chevronRight"
          label={t("next")}
          disabled={current === last}
          onClick={() => onPageChange(current + 1)}
          className="h-10! w-10! rounded-none!"
        />
        <ToolbarAction
          icon="chevronsRight"
          label={t("last")}
          disabled={current === last}
          onClick={() => onPageChange(last)}
          className="h-10! w-10! rounded-none!"
        />
      </nav>
    </div>
  );
}
