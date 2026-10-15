import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import Select, { type SelectOption } from "./Select.js";


export function DefaultSelect<T = string>(props: ComponentProps<typeof Select<T>>) {
  return <Select {...props} />;
}


export function BooleanSelect(props: Omit<ComponentProps<typeof Select<boolean>>, "options">) {
  const { t } = useTranslation("commons");
  const options: SelectOption<boolean>[] = [
    [t("yes"), true],
    [t("no"), false],
  ];

  return <Select {...props} options={options} />;
}
