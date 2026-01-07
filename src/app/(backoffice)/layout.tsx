// app/(backoffice)/layout.tsx
"use client";

import { ReactNode } from "react";
import AppShell from "@/components/AppShell";

export default function BackofficeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}