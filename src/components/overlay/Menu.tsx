import { forwardRef } from "react";

export interface MenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
}


export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(function MenuList({ className, children, ...props }, ref) {
  return (
    <ul ref={ref} {...props} className={`overflow-hidden rounded-medium bg-white shadow-lg ${className ?? ""}`}>
      {children}
    </ul>
  );
});

export interface MenuItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onClick"> {
  onSelect?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
}


export function MenuItem({ onSelect, disabled = false, selected, className, onKeyDown, children, ...props }: MenuItemProps) {
  function handleActivate() {
    if (disabled) return;
    onSelect?.();
  }

  return (
    <li
      {...props}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-selected={selected}
      className={`flex items-center-safe gap-2 px-4 py-2 font-medium select-none focus:outline-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-input-bg focus:bg-input-bg"} ${selected ? "bg-input-bg" : ""} ${className ?? ""}`}
      onClick={handleActivate}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleActivate();
        }
      }}>
      {children}
    </li>
  );
}
