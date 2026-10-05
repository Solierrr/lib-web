import { useEffect, useRef, useState, type SelectHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Colors from "../../../shared/styles/colors.js";
import Icon from "../icon/Icon.js";
import { MenuList, MenuItem } from "../../overlay/Menu.js";

export type SelectOption<T = string> = string | readonly [label: string, value: T];

function getOptionLabel<T>(option: SelectOption<T>): string {
  return typeof option === "string" ? option : option[0];
}

function getOptionValue<T>(option: SelectOption<T>): T {
  return typeof option === "string" ? (option as unknown as T) : option[1];
}

export interface SelectProps<T> {
  name: string;
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T | undefined) => void;
  placeholder?: string;
  rounded?: boolean;
  disabled?: boolean;
  clearable?: boolean;

  className?: string;
}

export function NativeSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & { name: string }) {
  return (
    <select
      {...props}
      className={`min-h-10 rounded-medium border border-operational-border bg-input-bg px-4 py-2 font-medium text-black focus-visible:outline-2 focus-visible:outline-operational-ink disabled:opacity-50 ${className}`}
    />
  );
}


export default function Select<T = string>({
  name,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  rounded = false,
  disabled = false,
  clearable = true,
  className,
}: SelectProps<T>) {
  const { t } = useTranslation("commons", { keyPrefix: "select" });
  const resolvedPlaceholder = placeholder ?? t("placeholder");

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((option) => getOptionValue(option) === selectedValue);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(option: SelectOption<T>) {
    const optionValue = getOptionValue(option);
    setInternalValue(optionValue);
    onChange?.(optionValue);
    setOpen(false);
  }

  function handleClear() {
    setInternalValue(undefined);
    onChange?.(undefined);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative w-fit ${className ?? ""}`}>
      <div
        className={`flex w-full items-center-safe justify-between gap-8 bg-input-bg ${selectedOption ? "pl-3 pr-4" : "px-4"} py-2 text-black font-medium cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""} ${rounded ? "rounded-full" : "rounded-medium"}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen((isOpen) => !isOpen)}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((isOpen) => !isOpen);
          }
        }}>
        <span className="flex items-center-safe gap-2">
          {selectedOption && clearable && (
            <button
              type="button"
              aria-label={t("clearSelection")}
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
              className="flex animate-fade-in">
              <Icon name="x" color={Colors.INPUTICON} className="cursor-pointer" />
            </button>
          )}

          <span className={`font-medium ${selectedOption ? "" : "text-input-text"} select-none`}>
            {selectedOption ? getOptionLabel(selectedOption) : resolvedPlaceholder}
          </span>
        </span>
        <Icon className={`transition-transform ${open ? "rotate-180" : ""}`} name="chevronDown" color={Colors.INPUTICON} />
      </div>

      {open && (
        <MenuList className="absolute z-10 mt-1 w-full" role="listbox" aria-label={name}>
          {options.map((option, index) => {
            const isSelected = getOptionValue(option) === selectedValue;

            return (
              <MenuItem
                key={index}
                role="option"
                selected={isSelected}
                onSelect={() => handleSelect(option)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setOpen(false);
                }}>
                {getOptionLabel(option)}
              </MenuItem>
            );
          })}
        </MenuList>
      )}
    </div>
  );
}
