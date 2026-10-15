import { useId, useState } from "react";
import Input from "../input/Input.js";
import { MenuItem, MenuList } from "../../overlay/Menu.js";

export interface Props {
  name: string;
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
  emptyLabel: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  normalize?: (value: string) => string;
}

export default function Combobox({ name, label, value, options, onChange, emptyLabel, required, placeholder, maxLength, normalize }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const normalizeSearch = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const matches = options.some(([, code]) => code === value)
    ? options
    : options.filter(([text, code]) => normalizeSearch(`${code} ${text}`).includes(normalizeSearch(value)));
  const currentIndex = Math.min(active, matches.length - 1);
  const select = (code: string) => {
    onChange(code);
    setOpen(false);
  };
  return (
    <div
      className="relative w-full"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <Input
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label={label}
        role="combobox"
        aria-expanded={open}
        aria-controls={id}
        aria-autocomplete="list"
        aria-activedescendant={open && currentIndex >= 0 ? `${id}-${currentIndex}` : undefined}
        value={value}
        required={required}
        pattern={options.map(([, code]) => code).join("|")}
        autoComplete="off"
        spellCheck={false}
        className="w-full"
        icon={{
          name: "chevronDown",
          label,
          onClick: () => {
            setOpen(!open);
            setActive(
              Math.max(
                0,
                options.findIndex(([, code]) => code === value),
              ),
            );
          },
        }}
        onFocus={() => {
          setOpen(true);
          setActive(
            Math.max(
              0,
              options.findIndex(([, code]) => code === value),
            ),
          );
        }}
        onChange={(event) => {
          const value = normalize ? normalize(event.target.value) : event.target.value.toUpperCase();
          event.currentTarget.value = value;
          onChange(value);
          setActive(
            Math.max(
              0,
              options.findIndex(([, code]) => code === value),
            ),
          );
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActive(Math.max(0, Math.min(matches.length - 1, active + (event.key === "ArrowDown" ? 1 : -1))));
          }
          if (event.key === "Enter" && open && matches[currentIndex]) {
            event.preventDefault();
            select(matches[currentIndex][1]);
          }
        }}
      />
      {open && (
        <MenuList id={id} role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto">
          {matches.map(([text, code], index) => (
            <MenuItem
              id={`${id}-${index}`}
              key={code}
              role="option"
              selected={index === currentIndex}
              onMouseDown={(event) => event.preventDefault()}
              onSelect={() => select(code)}>
              {text}
            </MenuItem>
          ))}
          {!matches.length && <li className="px-4 py-2 text-body">{emptyLabel}</li>}
        </MenuList>
      )}
    </div>
  );
}
