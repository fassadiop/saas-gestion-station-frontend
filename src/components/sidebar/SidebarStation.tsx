// src/components/sidebar/SidebarStation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Fuel,
  FileText,
  Users,
} from "lucide-react";
import { Repeat } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";


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

export default function SidebarStation() {
  const { user } = useAuth();
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="text-lg font-bold text-primary truncate">
          Station
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Exploitation
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        <Item
          href="/dashboard/station"
          label="Tableau de bord"
          icon={LayoutDashboard}
        />

        <Item
          href="/dashboard/station/relais"
          label="Gestion des relais"
          icon={Repeat}
        />

        {(user?.role === "GERANT" ||
          user?.role === "SUPERVISEUR") && (
          <Item
            href="/dashboard/station/depotages"
            label="Gestion des dépotages"
            icon={Fuel}
          />
        )}

        {(user?.role === "GERANT") && (
          <Item
            href="/dashboard/station/personnel"
            label="Personnel"
            icon={Users}
          />
        )}

        {/* <Item
          href="/dashboard/station/ventes"
          label="Ventes carburant"
          icon={Fuel}
        /> */}

        {(user?.role === "GERANT") && (
          <Item
            href="/dashboard/station/rapports"
            label="Rapports"
            icon={FileText}
          />
        )}
      </nav>
    </aside>
  );
}
