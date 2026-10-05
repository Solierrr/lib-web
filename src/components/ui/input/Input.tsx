import Colors from "../../../shared/styles/colors.js";
import Icon, { type IconName } from "../icon/Icon.js";

export interface InputIconProps {
  name: IconName;
  label?: string;
  inverse?: boolean;
  onClick?: () => void;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder?: string;
  rounded?: boolean;
  icon?: InputIconProps;

  className?: string;
}


export default function Input({ name, placeholder, icon, rounded = false, className, ...props }: InputProps) {
  const inverse = icon ? (icon.inverse ?? false) : undefined;

  const iconElement =
    icon &&
    (icon.onClick ? (
      <button type="button" aria-label={icon.label ?? name} onClick={icon.onClick} className={`flex cursor-pointer ${inverse ? "ml-2" : "mr-4"}`}>
        {" "}
        <Icon name={icon.name} color={Colors.INPUTICON} />{" "}
      </button>
    ) : (
      <Icon className={`${inverse ? "ml-2" : "mr-4"}`} name={icon.name} color={Colors.INPUTICON} />
    ));

  const inputElement = (
    <input
      className={`${inverse === undefined ? "px-4" : inverse ? "pr-4 pl-2" : "pr-2 pl-4"} min-w-0 bg-transparent py-2 text-black font-medium placeholder:text-input-text w-full placeholder:select-none caret-orange caret focus:outline-0 medium`}
      {...props}
      placeholder={placeholder}
      aria-label={props["aria-label"] ?? name}
      name={name}
    />
  );

  return (
    <div className={`flex w-fit bg-input-bg ${rounded ? "rounded-full" : "rounded-medium"} flex-row items-center-safe ${className ?? ""}`}>
      {inverse ? (
        <>
          {iconElement}
          {inputElement}
        </>
      ) : (
        <>
          {inputElement}
          {iconElement}
        </>
      )}
    </div>
  );
}
