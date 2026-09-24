import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@@/layout/sidebar/Sidebar";

interface SaaSLayoutProps {
  sidebar: ReactNode;
}

export function SaaSLayout({ sidebar }: SaaSLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar>{sidebar}</Sidebar>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
