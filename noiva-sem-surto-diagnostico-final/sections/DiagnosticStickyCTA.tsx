"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckoutLink } from "@/components/CheckoutLink";
import { DIAGNOSTIC_STORAGE_KEY } from "@/lib/diagnostic";

export function DiagnosticStickyCTA() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY) || "null") as { completed?: boolean } | null;
        setCompleted(Boolean(saved?.completed));
      } catch {
        setCompleted(false);
      }
    };
    read();
    window.addEventListener("nss:diagnostic-complete", read);
    return () => window.removeEventListener("nss:diagnostic-complete", read);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/10 bg-ink/95 p-3 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="text-xs text-cream">
          <div className="font-black text-sun">{completed ? "R$ 29,90" : "Diagnóstico gratuito"}</div>
          <div className="text-cream/60">{completed ? "Pagamento único" : "8 perguntas rápidas"}</div>
        </div>
        {completed ? (
          <CheckoutLink placement="mobile_sticky" className="nss-primary-btn px-4 py-2.5 text-xs">
            Continuar jornada <ArrowRight className="h-3.5 w-3.5" />
          </CheckoutLink>
        ) : (
          <a href="#diagnostico" className="nss-primary-btn px-4 py-2.5 text-xs">
            Fazer diagnóstico <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
