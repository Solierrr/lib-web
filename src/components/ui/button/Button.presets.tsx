import type { ComponentProps } from "react";
import Button from "./Button.js";
import type { IconName } from "../icon/Icon.js";
import Colors from "../../../shared/styles/colors.js";

type ButtonPresetProps = Omit<ComponentProps<typeof Button>, "bgColor" | "txtColor">;
type IconButtonProps = Omit<ButtonPresetProps, "content" | "icon"> & {
  icon: IconName;
};


export function PrimaryButton(props: ButtonPresetProps) {
  return <Button {...props} bgColor={Colors.ORANGE} txtColor={Colors.WHITE} />;
}

export function WhiteButton({ className = "", ...props }: ButtonPresetProps) {
  return <Button {...props} bgColor={Colors.WHITE} txtColor={Colors.BLACK} className={`aspect-button-white aspect-button-neutral ${className}`} />;
}


export function SecondaryButton(props: ButtonPresetProps) {
  return <Button {...props} bgColor={Colors.BLACK} txtColor={Colors.WHITE} />;
}


export function IconButton({ icon, ...props }: IconButtonProps) {
  return <Button {...props} icon={{ name: icon }} bgColor={Colors.ORANGE} txtColor={Colors.WHITE} />;
}


export function LightIconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <Button {...props} icon={{ name: icon }} bgColor={Colors.WHITE} txtColor={Colors.ORANGE} className={`shadow-soft-black ${className ?? ""}`} />
  );
}


export function SoftIconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      icon={{ name: icon }}
      bgColor={Colors.WHITE}
      txtColor={Colors.ORANGE}
      rounded={false}
      className={`no-bg-interactive! ${className ?? ""}`}
    />
  );
}
