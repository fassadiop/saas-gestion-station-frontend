// src/app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthProvider";
import { queryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
