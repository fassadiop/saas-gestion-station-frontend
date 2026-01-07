// src/components/sidebar/SidebarFinance.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Users,
  Briefcase,
  UserCog,
} from "lucide-react";

/* --------------------------------------
   Sidebar Item
---------------------------------------*/
function SidebarItem({
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

/* --------------------------------------
   SIDEBAR FINANCE (TENANT)
---------------------------------------*/
export default function SidebarFinance() {
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="text-lg font-bold text-primary truncate">
          Gestion financière
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Organisation / Tenant
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {/* --- GÉNÉRAL --- */}
        <div className="space-y-1">
          <div className="px-2 text-xs uppercase text-gray-400 font-semibold">
            Général
          </div>

          <SidebarItem
            href="/dashboard/tenant"
            label="Tableau de bord"
            icon={LayoutDashboard}
          />
        </div>

        {/* --- FINANCES --- */}
        <div className="space-y-1">
          <div className="px-2 text-xs uppercase text-gray-400 font-semibold">
            Finances
          </div>

          <SidebarItem
            href="/dashboard/tenant/transactions"
            label="Transactions"
            icon={ArrowLeftRight}
          />

          <SidebarItem
            href="/dashboard/tenant/cotisations"
            label="Cotisations"
            icon={Wallet}
          />
        </div>

        {/* --- GESTION --- */}
        <div className="space-y-1">
          <div className="px-2 text-xs uppercase text-gray-400 font-semibold">
            Gestion
          </div>

          <SidebarItem
            href="/dashboard/tenant/membres"
            label="Membres"
            icon={Users}
          />

          <SidebarItem
            href="/dashboard/tenant/personnel"
            label="Personnel"
            icon={UserCog}
          />

          <SidebarItem
            href="/dashboard/tenant/projets"
            label="Projets"
            icon={Briefcase}
          />
        </div>
      </nav>
    </aside>
  );
}
