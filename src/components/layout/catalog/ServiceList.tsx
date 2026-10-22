import type { ReactNode } from "react";
import Surface from "../../ui/surface/Surface.js";
import LinkShare, { type LinkShareLabels } from "../../ui/link-share/LinkShare.js";

export interface ServiceListLink {
  label: string;
  icon: ReactNode;
  tag?: string;
  href?: string;
}

export interface ServiceListItem {
  name: string;
  description?: string;
  links: ServiceListLink[];
}

export interface ServiceListProps {
  items: ServiceListItem[];
  labels?: Partial<LinkShareLabels>;
  className?: string;
}

export default function ServiceList({ items, labels, className = "" }: ServiceListProps) {
  return (
    <Surface className={`w-full ${className}`}>
      <ul className="divide-y divide-operational-border/60">
        {items.map((item) => (
          <li key={item.name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
            <span className="min-w-0 flex-1 basis-40 truncate font-medium text-operational-ink" title={item.description}>
              {item.name}
            </span>
            <span className="flex flex-wrap items-center gap-2">
              {item.links.map((link) => (
                <LinkShare
                  key={`${link.label}-${link.tag ?? ""}`}
                  label={link.label}
                  href={link.href}
                  icon={link.icon}
                  tag={link.tag}
                  context={item.name}
                  labels={labels}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
