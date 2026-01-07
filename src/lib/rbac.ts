// src/lib/rbac.ts
import { Role } from "@/constants/roles";
import { User } from "@/types/user";

export const isSuperAdmin = (u: User) => u.is_superuser;

export const hasRole = (u: User, roles: Role[]) =>
  roles.includes(u.role as Role);
