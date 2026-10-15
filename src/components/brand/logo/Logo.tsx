import logoUrl from "../../../assets/snowflake.svg";


export interface LogoProps {
    width?: number;
    className?: string;
}

export default function Logo({ width = 3, className }: LogoProps) {

    return (
        <img src={logoUrl} className={`h-fit aspect-square ${className ?? ""}`} style={{ width: `${width}rem` }} alt="Solaria" />
    );
}
