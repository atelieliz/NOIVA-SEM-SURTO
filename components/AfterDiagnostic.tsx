"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { DIAGNOSTIC_STORAGE_KEY } from "@/lib/diagnostic";

function hasCompletedDiagnostic() {
  if (typeof window === "undefined") return false;
  try {
    const saved = JSON.parse(window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY) || "null") as
      | { completed?: boolean }
      | null;
    return Boolean(saved?.completed);
  } catch {
    return false;
  }
}

export function AfterDiagnostic({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const read = () => setVisible(hasCompletedDiagnostic());
    read();
    window.addEventListener("nss:diagnostic-complete", read);
    window.addEventListener("nss:diagnostic-reset", read);
    return () => {
      window.removeEventListener("nss:diagnostic-complete", read);
      window.removeEventListener("nss:diagnostic-reset", read);
    };
  }, []);

  if (!visible) return null;
  return <>{children}</>;
}
