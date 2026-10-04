import { Link } from "react-router-dom";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300";

export interface EntityCardItem {
  id: string;
  name: string;
  avatarUrl?: string;
  subtitle?: string;
  href: string;
}

export interface EntityCardProps {
  item: EntityCardItem;
  className?: string;
}


export default function EntityCard({ item, className }: EntityCardProps) {
  return (
    <Link to={item.href} className={`flex flex-col items-center gap-2 text-center ${className ?? ""}`}>
      <img src={item.avatarUrl ?? DEFAULT_AVATAR} alt={item.name} className="aspect-square w-full rounded-full bg-input-bg object-cover" />
      <p className="font-medium">{item.name}</p>
      {item.subtitle && <p className="text-input-text">{item.subtitle}</p>}
    </Link>
  );
}
