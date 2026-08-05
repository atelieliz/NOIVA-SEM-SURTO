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
    setVisible(hasCompletedDiagnostic());
    const show = () => setVisible(true);
    window.addEventListener("nss:diagnostic-complete", show);
    return () => window.removeEventListener("nss:diagnostic-complete", show);
  }, []);

  if (!visible) {
    return (
      <section className="px-5 pb-20" aria-label="Conteúdo após o diagnóstico">
        <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-ink/15 bg-white/60 p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink/60">
            Sua leitura personalizada e a continuação do planejamento aparecem aqui após as 8 perguntas.
          </p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
