"use client";

import React, { useEffect, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function UserGreeting() {
  const [label, setLabel] = useState<string>("Utilisateur");
  const { data: me, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && me) {
      const name = (me as any).username ?? (me as any).first_name ?? "Utilisateur";
      setLabel(name);
    }
  }, [me, isLoading]);

  return <span className="font-medium">{label}</span>;
}
