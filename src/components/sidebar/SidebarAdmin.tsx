// src/components/sidebar/SidebarAdmin.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarAdmin() {
  const pathname = usePathname() ?? "";

  const linkClass = (href: string) =>
    `block px-4 py-2 rounded transition ${
      pathname.startsWith(href)
        ? "bg-primary text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xs uppercase text-gray-400 tracking-wide">
          Gouvernance SaaS
        </h2>
      </div>

      <nav className="space-y-2">
        <Link href="/tenants" className={linkClass("/tenants")}>
          Organisations (Tenants)
        </Link>

        <Link href="/utilisateurs" className={linkClass("/utilisateurs")}>
          Admins des organisations
        </Link>
      </nav>
    </aside>
  );
}
