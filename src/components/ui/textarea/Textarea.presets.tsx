import { useState, type ComponentProps } from "react";
import Textarea from "./Textarea.js";

type TextareaPresetProps = ComponentProps<typeof Textarea>;
type CharCountTextareaProps = Omit<TextareaPresetProps, "value" | "defaultValue"> & {
  maxLength: number;
  value?: string;
  defaultValue?: string;
};


export function DefaultTextarea(props: TextareaPresetProps) {
  return <Textarea {...props} />;
}


export function CharCountTextarea({ maxLength, value, defaultValue, onChange, ...props }: CharCountTextareaProps) {
  const [length, setLength] = useState((value ?? defaultValue ?? "").length);

  return (
    <div className="flex w-fit flex-col gap-1">
      <Textarea
        {...props}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(event) => {
          setLength(event.target.value.length);
          onChange?.(event);
        }}
      />
      <span className="text-caption font-medium text-input-text self-end">
        {length}/{maxLength}
      </span>
    </div>
  );
}
