import { useState, type ReactNode } from "react";
import Pagination from "../../ui/pagination/Pagination.js";
import Skeleton from "../../feedback/skeleton/Skeleton.js";

export interface OperationalColumn<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

export interface OperationalTableProps<T> {
  label: string;
  columns: OperationalColumn<T>[];
  items: T[] | null;
  getKey: (item: T) => string;
  empty: string;
}

export default function OperationalTable<T>({ label, columns, items, getKey, empty }: OperationalTableProps<T>) {
  const [page, setPage] = useState(1);
  const current = Math.min(page, Math.max(1, Math.ceil((items?.length ?? 0) / 5)));
  const visible = items?.slice((current - 1) * 5, current * 5);
  return (
    <section
      aria-label={label}
      aria-busy={items === null}
      className="mx-auto w-full min-w-0 overflow-hidden rounded-hard border border-operational-border bg-white lg:w-[85%]">
      <div className="scrollbar-none overflow-x-auto">
        <table className="w-full border-collapse text-left text-body" aria-label={label}>
          <thead className="border-b border-operational-border bg-operational-surface">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-4 font-semi-bold text-operational-muted">
                  {items === null ? <Skeleton height="1rem" width="6rem" /> : column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-operational-border">
            {visible?.map((item) => (
              <tr key={getKey(item)} className="hover:bg-operational-hover/40">
                {columns.map((column) => (
                  <td key={column.key} className="h-20 px-4 py-0 align-middle">
                    <div className="scrollbar-none flex h-[calc(5rem_-_1px)] min-w-16 items-center overflow-auto py-3">
                      <div className="max-h-full w-full">{column.render(item)}</div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {items === null &&
              Array.from({ length: 3 }, (_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="h-20 px-4">
                      <Skeleton height="1rem" width="80%" />
                    </td>
                  ))}
                </tr>
              ))}
            {items?.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="h-20 px-4 py-0 text-center text-operational-muted">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {items !== null && <Pagination page={current} total={items.length} onPageChange={setPage} />}
    </section>
  );
}
