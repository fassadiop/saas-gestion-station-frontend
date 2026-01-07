import { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  Building2,
  Fuel,
  Wallet,
  Settings,
} from "lucide-react"

export type SidebarRole =
  | "SuperAdmin"
  | "AdminTenant"
  | "Tresorier"
  | "Collecteur"

export interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
  roles: SidebarRole[]
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    roles: ["SuperAdmin"],
  },
  {
    label: "Dashboard",
    href: "/dashboard/tenant",
    icon: LayoutDashboard,
    roles: ["AdminTenant", "Tresorier"],
  },
  {
    label: "Tenants",
    href: "/tenants",
    icon: Building2,
    roles: ["SuperAdmin"],
  },
  {
    label: "Administrateurs",
    href: "/utilisateurs",
    icon: Users,
    roles: ["SuperAdmin"],
  },
  {
    label: "Stations",
    href: "/stations",
    icon: Fuel,
    roles: ["AdminTenant"],
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: Wallet,
    roles: ["AdminTenant", "Tresorier", "Collecteur"],
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
    roles: ["AdminTenant", "SuperAdmin"],
  },
]
