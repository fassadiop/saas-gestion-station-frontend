// src/components/sidebar/SidebarAdminTenantStation.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  Fuel,
  MapPin,
} from "lucide-react";

function Item({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
        ${
          active
            ? "bg-primary/10 text-primary"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function SidebarAdminTenantStation() {
  console.log("SidebarAdminTenantStation rendered");
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="text-lg font-bold text-primary truncate">
          Admin Stations
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Supervision multi-stations
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        <Item
          href="/dashboard/admin-tenant/station"
          label="Dashboard"
          icon={LayoutDashboard}
        />

        <Item
          href="/dashboard/admin-tenant/station/stations"
          label="Stations"
          icon={MapPin}
        />

        <Item
          href="/dashboard/admin-tenant/station/nouveau"
          label="Créer une station"
          icon={PlusSquare}
        />
      </nav>
    </aside>
  );
}
